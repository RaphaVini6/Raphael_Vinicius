namespace Backend.Models;

public class SimulationRequest
{
    public string ProbeId { get; set; } = "";
    public Dictionary<HardwareCategory, string> Components { get; set; } = new();
    public int? TargetDays { get; set; }
}

public class SimulationResult
{
    public string ProbeId { get; set; } = "";
    public Destination Destination { get; set; }
    public int DaysSurvived { get; set; }
    public int PlannedDurationDays { get; set; }
    public int? ActualDurationDays { get; set; }
    public bool MissionAccomplished { get; set; }
    public int Score { get; set; }
    public string EndReason { get; set; } = "";
    public SimulationMetrics Metrics { get; set; } = new();
    public List<SimulationEvent> Events { get; set; } = new();
    public Dictionary<HardwareCategory, string> RealHardware { get; set; } = new();
}

public class SimulationMetrics
{
    public double TotalMassKg { get; set; }
    public double BaseConsumptionW { get; set; }
    public double InitialOutputW { get; set; }
    public double BatteryCapacityWh { get; set; }
    public double MinSupportedTempC { get; set; }
    public double MaxSupportedTempC { get; set; }
    public int RadiationReboots { get; set; }
}

// Type: Heat, Storm, Power, Dust, Mobility, Radiation, Summary, End
public record SimulationEvent(int Day, string Type, string Message);
