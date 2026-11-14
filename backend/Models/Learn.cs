using Backend.Localization;

namespace Backend.Models;

public class LearnData
{
    public LocalizedText Note { get; set; } = new();
    public List<LearnTopic> Precedents { get; set; } = new();
    public List<LearnTopic> Methodology { get; set; } = new();
    public RoboticsData Robotics { get; set; } = new();

    public object ToDto(string lang) => new
    {
        note = Note.Get(lang),
        precedents = Precedents.Select(t => t.ToDto(lang)),
        methodology = Methodology.Select(t => t.ToDto(lang)),
        robotics = new { reference = Robotics.Reference.Get(lang), topics = Robotics.Topics.Select(t => t.ToDto(lang)) },
    };
}

public class LearnTopic
{
    public LocalizedText Title { get; set; } = new();
    public LocalizedText Text { get; set; } = new();

    public object ToDto(string lang) => new { title = Title.Get(lang), text = Text.Get(lang) };
}

public class RoboticsData
{
    public LocalizedText Reference { get; set; } = new();
    public List<LearnTopic> Topics { get; set; } = new();
}
