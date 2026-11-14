using Backend.Localization;

namespace Backend.Models;

public record PlanetaryEnvironment(
    Destination Destination,
    double GravityMs2,
    double MinTempC,
    double MaxTempC,
    double PressureKPa,
    double SolarIrradianceWm2,
    double LightHoursPerCycle,
    double DarkHoursPerCycle,
    double PanelDustLossPctPerDay,
    int Radiation,
    bool HasRelayOrbiter,
    LocalizedText Description)
{
    public static readonly PlanetaryEnvironment Moon = new(
        Destination.Moon, 1.62, -173, 127, 0, 1361, 354, 354, 0, 7, false, new()
        {
            ["en"] = "No atmosphere, day and night of about 14 Earth days each, extreme temperatures and abrasive regolith.",
            ["pt"] = "Sem atmosfera, dia e noite de cerca de 14 dias terrestres cada, temperaturas extremas e regolito abrasivo.",
            ["es"] = "Sin atmósfera, día y noche de unos 14 días terrestres cada uno, temperaturas extremas y regolito abrasivo.",
            ["fr"] = "Pas d'atmosphère, jour et nuit d'environ 14 jours terrestres chacun, températures extrêmes et régolithe abrasif.",
        });

    public static readonly PlanetaryEnvironment Mars = new(
        Destination.Mars, 3.71, -90, 20, 0.6, 590, 12.3, 12.3, 0.11, 5, true, new()
        {
            ["en"] = "Thin CO2 atmosphere, a 24.6-hour sol, freezing nights, dust that covers panels and global dust storms.",
            ["pt"] = "Atmosfera fina de CO2, sol de 24,6 horas, noites geladas, poeira que cobre os painéis e tempestades globais.",
            ["es"] = "Atmósfera delgada de CO2, sol de 24,6 horas, noches heladas, polvo que cubre los paneles y tormentas globales.",
            ["fr"] = "Atmosphère ténue de CO2, sol de 24,6 heures, nuits glaciales, poussière qui recouvre les panneaux et tempêtes globales.",
        });

    public static PlanetaryEnvironment Of(Destination d) => d == Destination.Moon ? Moon : Mars;

    public object ToDto(string lang) => new
    {
        Destination, GravityMs2, MinTempC, MaxTempC, PressureKPa, SolarIrradianceWm2,
        LightHoursPerCycle, DarkHoursPerCycle, PanelDustLossPctPerDay, Radiation, HasRelayOrbiter,
        Description = Description.Get(lang),
    };
}
