using Backend.Localization;

namespace Backend.Models;

public class ComponentData
{
    public string Id { get; set; } = "";
    public LocalizedText Name { get; set; } = new();
    public HardwareCategory Category { get; set; }
    public LocalizedText Description { get; set; } = new();
    public string Inspiration { get; set; } = "";
    public double MassKg { get; set; }

    // Power
    public double OutputW { get; set; }
    public bool NeedsSunlight { get; set; }
    public bool DustSensitive { get; set; }
    public double ConsumptionW { get; set; }
    public double CapacityWh { get; set; }
    public bool Rechargeable { get; set; } = true;
    // % per day
    public double DegradationPctPerDay { get; set; }

    // Thermal (operating range of the part and protection it adds)
    public double MinTempC { get; set; } = -200;
    public double MaxTempC { get; set; } = 200;
    public double ColdProtectionC { get; set; }
    public double HeatProtectionC { get; set; }
    public double NightConsumptionW { get; set; }

    // Other
    public int RadiationTolerance { get; set; } = 10; // 0-10
    public bool NeedsRelayOrbiter { get; set; }
    public int? ServiceLifeDays { get; set; }          // wear (mobility)

    public HardwareComponent ToDto(string lang) => new(
        Id, Name.Get(lang), Category, Description.Get(lang), Inspiration, MassKg, OutputW, NeedsSunlight,
        DustSensitive, ConsumptionW, CapacityWh, Rechargeable, DegradationPctPerDay, MinTempC, MaxTempC,
        ColdProtectionC, HeatProtectionC, NightConsumptionW, RadiationTolerance, NeedsRelayOrbiter, ServiceLifeDays);
}

public record HardwareComponent(
    string Id, string Name, HardwareCategory Category, string Description, string Inspiration, double MassKg,
    double OutputW, bool NeedsSunlight, bool DustSensitive, double ConsumptionW, double CapacityWh,
    bool Rechargeable, double DegradationPctPerDay, double MinTempC, double MaxTempC, double ColdProtectionC,
    double HeatProtectionC, double NightConsumptionW, int RadiationTolerance, bool NeedsRelayOrbiter,
    int? ServiceLifeDays);
