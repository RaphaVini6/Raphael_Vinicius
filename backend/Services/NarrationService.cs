using System.Text;
using Backend.Localization;
using Backend.Models;

namespace Backend.Services;

// Texts for screen readers / TTS: short sentences, dates written out, no coordinates.
public class NarrationService
{
    public string Probe(ProbeData p, string lang)
    {
        string M(string key, params object[] args) => Messages.Get(key, lang, args);

        var sb = new StringBuilder();
        sb.Append(M("nar.intro", p.Name.Get(lang), M($"nar.type.{p.Type}"), p.Mission.Get(lang), M($"nar.dest.{p.Destination}"))).Append(' ');
        sb.Append(M("nar.dates", Date(p.Launch, lang), Date(p.Landing, lang))).Append(' ');
        sb.Append(p.Status == ProbeStatus.Active ? M("nar.active") : M("nar.inactive", p.StatusDetail.Get(lang))).Append(' ');
        sb.Append(M("nar.location", p.Location.Get(lang))).Append(' ');
        sb.Append(M("nar.function", p.Function.Get(lang))).Append(' ');
        sb.Append(M("nar.reuse", p.MechanicalReuse.Get(lang))).Append(' ');
        if (p.ImageAudioDescription?.Get(lang) is { Length: > 0 } image)
            sb.Append(M("nar.image", image)).Append(' ');
        sb.Append(M("nar.source", p.Source.Name));
        return sb.ToString();
    }

    public string Simulation(ProbeData p, SimulationResult r, string lang)
    {
        string M(string key, params object[] args) => Messages.Get(key, lang, args);
        string Days(int n) => n == 1 ? M("nar.day") : M("nar.days", n);

        var sb = new StringBuilder();
        sb.Append(M("nar.sim.title", p.Name.Get(lang))).Append(' ');
        sb.Append(M("nar.sim.survived", Days(r.DaysSurvived))).Append(' ');
        sb.Append(M("nar.sim.planned", Days(r.PlannedDurationDays))).Append(' ');
        if (r.ActualDurationDays is int actual) sb.Append(M("nar.sim.actual", Days(actual))).Append(' ');
        sb.Append(r.MissionAccomplished ? M("nar.sim.success") : M("nar.sim.fail")).Append(' ');
        sb.Append(M("nar.sim.score", r.Score)).Append(' ');
        sb.Append(r.EndReason).Append(' ');

        var keyEvents = r.Events.Where(e => e.Type != "End").Take(6).ToList();
        if (keyEvents.Count > 0)
        {
            sb.Append(M("nar.sim.events")).Append(' ');
            foreach (var e in keyEvents) sb.Append(M("nar.sim.event", e.Day, e.Message)).Append(' ');
        }
        return sb.ToString().Trim();
    }

    private static string Date(string value, string lang) =>
        DateOnly.TryParseExact(value, "yyyy-MM-dd", out var d)
            ? d.ToString(Messages.Get("nar.dateFormat", lang), Lang.Culture(lang))
            : value;
}
