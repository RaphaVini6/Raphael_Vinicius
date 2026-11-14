using Backend.Localization;
using Backend.Models;

namespace Backend.Services;

// Day-by-day simulation of a probe build under a real mission scenario. Values are approximate.
public class SimulationService(DataStore store)
{
    private const int MaxDays = 7000;
    private const double SurvivalFactor = 0.25;      // in hibernation the probe uses 25% of its normal draw
    private const double AverageSolarEfficiency = 0.64; // the Sun is not overhead all day
    private const double LunarDay = 29.5, HalfLunarDay = 14.75;
    private const int WindCleaningInterval = 250;

    public SimulationResult Simulate(SimulationRequest req, string lang)
    {
        string M(string key, params object[] args) => Messages.Get(key, lang, args);

        var probe = store.Probe(req.ProbeId)
            ?? throw new ArgumentException(M("err.probeNotFound", req.ProbeId));

        var parts = new Dictionary<HardwareCategory, ComponentData>();
        foreach (var cat in Enum.GetValues<HardwareCategory>())
        {
            var id = req.Components.GetValueOrDefault(cat) ?? probe.RealHardware.GetValueOrDefault(cat);
            if (id is null) continue;
            var c = store.Component(id) ?? throw new ArgumentException(M("err.componentNotFound", id));
            if (c.Category != cat) throw new ArgumentException(M("err.wrongCategory", id, cat));
            parts[cat] = c;
        }

        var env = PlanetaryEnvironment.Of(probe.Destination);
        var scn = probe.Scenario;
        var envMin = scn.MinTempC ?? env.MinTempC;
        var envMax = scn.MaxTempC ?? env.MaxTempC;
        var target = Math.Clamp(req.TargetDays ?? scn.ActualDurationDays ?? scn.PlannedDurationDays, 1, MaxDays);

        ComponentData? P(HardwareCategory c) => parts.GetValueOrDefault(c);
        var power = P(HardwareCategory.Power);
        var battery = P(HardwareCategory.Storage);
        var thermal = P(HardwareCategory.Thermal);
        var mobility = P(HardwareCategory.Mobility);
        var comms = P(HardwareCategory.Communication);
        var computer = P(HardwareCategory.Computer);

        var events = new List<SimulationEvent>();
        var metrics = new SimulationMetrics
        {
            TotalMassKg = Math.Round(parts.Values.Sum(p => p.MassKg), 1),
            BaseConsumptionW = parts.Values.Sum(p => p.ConsumptionW),
            InitialOutputW = power is null ? 0 : Math.Round(power.OutputW * (power.NeedsSunlight ? env.SolarIrradianceWm2 / 1361 : 1), 1),
            BatteryCapacityWh = battery?.CapacityWh ?? 0,
        };

        // weakest part sets the limit, insulation and RTG heat extend it
        var sensitive = new[] { battery, computer, power }.OfType<ComponentData>().ToList();
        var coldProt = (thermal?.ColdProtectionC ?? 0) + (power?.ColdProtectionC ?? 0);
        var heatProt = thermal?.HeatProtectionC ?? 0;
        metrics.MinSupportedTempC = (sensitive.Count == 0 ? -200 : sensitive.Max(p => p.MinTempC)) - coldProt;
        metrics.MaxSupportedTempC = (sensitive.Count == 0 ? 200 : sensitive.Min(p => p.MaxTempC)) + heatProt;

        int penalties = 0;
        string endReason = "";
        int day = 0;

        if (comms?.NeedsRelayOrbiter == true && !env.HasRelayOrbiter)
            endReason = M("sim.noRelay");
        else if (mobility?.Id == "carbon-fiber-rotor" && env.PressureKPa <= 0)
            endReason = M("sim.noAtmosphere");

        if (envMax > metrics.MaxSupportedTempC)
        {
            penalties++;
            events.Add(new(1, "Heat", M("sim.overheat", envMax, metrics.MaxSupportedTempC)));
        }

        var radiationGap = env.Radiation - (computer?.RadiationTolerance ?? 10);
        double charge = battery?.CapacityWh ?? 0;
        double dust = 1.0;
        bool hibernating = false, mobilityLost = false, coldChecked = false;
        int hibernationDays = 0;

        for (day = 1; endReason == "" && day <= target; day++)
        {
            // Mars: day and night every sol. Moon: ~14.75 days of light, then ~14.75 of dark
            double lightHours, darkHours;
            if (env.Destination == Destination.Mars) { lightHours = env.LightHoursPerCycle; darkHours = env.DarkHoursPerCycle; }
            else { var lit = (day - 1) % LunarDay < HalfLunarDay; lightHours = lit ? 24 : 0; darkHours = lit ? 0 : 24; }

            if (darkHours > 0 && !coldChecked)
            {
                coldChecked = true;
                if (envMin < metrics.MinSupportedTempC)
                {
                    endReason = M("sim.froze", envMin, metrics.MinSupportedTempC);
                    break;
                }
            }

            var capacity = Math.Max(0, (battery?.CapacityWh ?? 0) * (1 - (battery?.DegradationPctPerDay ?? 0) / 100 * day));
            if (battery is { Rechargeable: false }) capacity = Math.Min(capacity, charge);
            charge = Math.Min(charge, capacity);

            var storm = scn.DustStorms.FirstOrDefault(t => day >= t.StartDay && day < t.StartDay + t.DurationDays);
            if (storm is not null && day == storm.StartDay)
                events.Add(new(day, "Storm", M("sim.storm", storm.Description.Get(lang), storm.LightFactor)));

            double solarW = 0, rtgW = 0;
            if (power is { NeedsSunlight: true })
                solarW = power.OutputW * (env.SolarIrradianceWm2 / 1361) * AverageSolarEfficiency
                         * (power.DustSensitive ? dust : 1) * (storm?.LightFactor ?? 1);
            else if (power is not null)
                rtgW = power.OutputW * Math.Max(0, 1 - power.DegradationPctPerDay / 100 * day);

            var generated = solarW * lightHours + rtgW * 24;
            var drawW = metrics.BaseConsumptionW;
            var heaterW = thermal?.NightConsumptionW ?? 0;

            // normal -> hibernation -> dead
            bool Feasible(double factor, out double balance)
            {
                var nightFromBattery = Math.Max(0, drawW * factor + heaterW - rtgW) * darkHours;
                balance = charge + generated - (drawW * factor * 24 + heaterW * darkHours);
                return balance >= 0 && (darkHours == 0 || nightFromBattery <= Math.Max(capacity, 0) + (lightHours == 0 ? generated : 0));
            }

            if (Feasible(1, out var normalBalance))
            {
                if (hibernating) events.Add(new(day, "Power", M("sim.wakeUp")));
                hibernating = false;
                charge = Math.Min(capacity, normalBalance);
            }
            else if (Feasible(SurvivalFactor, out var survivalBalance))
            {
                if (!hibernating) events.Add(new(day, "Power", M("sim.hibernate")));
                hibernating = true;
                hibernationDays++;
                charge = Math.Min(capacity, survivalBalance);
            }
            else
            {
                endReason = battery is null || capacity <= 0 ? M("sim.noBattery")
                    : power is null || power.OutputW == 0 ? M("sim.batteryEmpty")
                    : M("sim.noPower");
                break;
            }

            if (env.PanelDustLossPctPerDay > 0) dust *= 1 - env.PanelDustLossPctPerDay / 100;
            if (scn.WindCleansPanels && power?.DustSensitive == true && day % WindCleaningInterval == 0)
            {
                dust = Math.Min(1, dust + 0.5);
                events.Add(new(day, "Dust", M("sim.windClean")));
            }

            if (!mobilityLost && mobility?.ServiceLifeDays is int life && day >= life)
            {
                mobilityLost = true;
                if (probe.Type == ProbeType.Helicopter)
                {
                    endReason = M("sim.rotorBroken");
                    break;
                }
                events.Add(new(day, "Mobility", M("sim.wornOut", mobility.Name.Get(lang))));
            }

            if (radiationGap >= 4 && day >= 30)
            {
                endReason = M("sim.radiationFatal", computer?.Name.Get(lang) ?? "");
                break;
            }
            if (radiationGap > 0 && day % (100 / radiationGap) == 0)
                metrics.RadiationReboots++;
        }

        var survived = endReason == "" ? target : Math.Max(0, day - 1);
        if (endReason == "") endReason = M("sim.stillRunning", target);
        else events.Add(new(Math.Max(survived, 1), "End", endReason));

        if (metrics.RadiationReboots > 0)
        {
            events.Add(new(1, "Radiation", M("sim.reboots", metrics.RadiationReboots)));
            if (metrics.RadiationReboots > 10) penalties++;
        }
        if (hibernationDays > 0)
            events.Add(new(survived, "Summary", M("sim.hibernationSummary", hibernationDays)));

        var actual = scn.ActualDurationDays ?? scn.PlannedDurationDays;
        var score = 70.0 * Math.Min(1, (double)survived / scn.PlannedDurationDays)
                  + 30.0 * Math.Min(1, (double)survived / actual)
                  - 10 * penalties
                  - 10.0 * hibernationDays / Math.Max(1, survived);

        return new SimulationResult
        {
            ProbeId = probe.Id,
            Destination = probe.Destination,
            DaysSurvived = survived,
            PlannedDurationDays = scn.PlannedDurationDays,
            ActualDurationDays = scn.ActualDurationDays,
            MissionAccomplished = survived >= scn.PlannedDurationDays,
            Score = (int)Math.Round(Math.Clamp(score, 0, 100)),
            EndReason = endReason,
            Metrics = metrics,
            Events = events.OrderBy(e => e.Day).Take(100).ToList(),
            RealHardware = probe.RealHardware,
        };
    }
}
