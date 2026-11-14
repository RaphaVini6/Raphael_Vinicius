using Backend.Localization;

namespace Backend.Models;

public class ProbeData
{
    public string Id { get; set; } = "";
    public LocalizedText Name { get; set; } = new();
    public LocalizedText Equipment { get; set; } = new();
    public LocalizedText Mission { get; set; } = new();
    public Destination Destination { get; set; }
    public ProbeType Type { get; set; }
    public string Launch { get; set; } = "";
    public string Landing { get; set; } = "";
    public ProbeStatus Status { get; set; }
    public LocalizedText StatusDetail { get; set; } = new();
    public LocalizedText Location { get; set; } = new();
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public LocalizedText Function { get; set; } = new();
    public LocalizedText MechanicalReuse { get; set; } = new();
    public Source Source { get; set; } = new();
    public LocalizedText Reliability { get; set; } = new();
    public string? ImageUrl { get; set; }
    public LocalizedText? ImageAudioDescription { get; set; }
    // category -> component id
    public Dictionary<HardwareCategory, string> RealHardware { get; set; } = new();
    public ScenarioData Scenario { get; set; } = new();

    public Probe ToDto(string lang) => new(
        Id, Name.Get(lang), Equipment.Get(lang), Mission.Get(lang), Destination, Type, Launch, Landing, Status,
        StatusDetail.Get(lang), Location.Get(lang), Latitude, Longitude, Function.Get(lang), MechanicalReuse.Get(lang),
        Source, Reliability.Get(lang), ImageUrl, ImageAudioDescription?.Get(lang), RealHardware, Scenario.ToDto(lang));
}

public class Source
{
    public string Name { get; set; } = "";
    public string? Url { get; set; }
}

public class ScenarioData
{
    public int PlannedDurationDays { get; set; }
    public int? ActualDurationDays { get; set; }
    public double? MinTempC { get; set; }   // overrides the destination default
    public double? MaxTempC { get; set; }
    public bool WindCleansPanels { get; set; }
    public List<DustStormData> DustStorms { get; set; } = new();
    public LocalizedText Summary { get; set; } = new();

    public Scenario ToDto(string lang) => new(
        PlannedDurationDays, ActualDurationDays, MinTempC, MaxTempC, WindCleansPanels,
        DustStorms.Select(d => new DustStorm(d.StartDay, d.DurationDays, d.LightFactor, d.Description.Get(lang))).ToList(),
        Summary.Get(lang));
}

public class DustStormData
{
    public int StartDay { get; set; }
    public int DurationDays { get; set; }
    // 0-1
    public double LightFactor { get; set; }
    public LocalizedText Description { get; set; } = new();
}

public record Probe(
    string Id, string Name, string Equipment, string Mission, Destination Destination, ProbeType Type,
    string Launch, string Landing, ProbeStatus Status, string StatusDetail, string Location,
    double? Latitude, double? Longitude, string Function, string MechanicalReuse, Source Source,
    string Reliability, string? ImageUrl, string? ImageAudioDescription,
    Dictionary<HardwareCategory, string> RealHardware, Scenario Scenario);

public record Scenario(
    int PlannedDurationDays, int? ActualDurationDays, double? MinTempC, double? MaxTempC,
    bool WindCleansPanels, List<DustStorm> DustStorms, string Summary);

public record DustStorm(int StartDay, int DurationDays, double LightFactor, string Description);
