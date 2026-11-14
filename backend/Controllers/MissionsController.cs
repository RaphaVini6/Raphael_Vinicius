using Backend.Localization;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/missions")]
public class MissionsController(DataStore store) : ControllerBase
{
    [HttpGet]
    public IEnumerable<MissionSummary> List(Destination? destination)
    {
        var lang = Lang.Current;
        return store.Probes
            .Where(p => destination is null || p.Destination == destination)
            .GroupBy(p => p.Mission.Get(Lang.Default))
            .Select(g => new MissionSummary(
                g.First().Mission.Get(lang),
                g.First().Destination,
                g.Min(p => p.Landing)!,
                g.Any(p => p.Status == ProbeStatus.Active) ? ProbeStatus.Active : ProbeStatus.Inactive,
                g.Select(p => new ProbeRef(p.Id, p.Name.Get(lang))).ToList()))
            .OrderBy(m => m.Landing);
    }

    [HttpGet("environments")]
    public IEnumerable<object> Environments() =>
        [PlanetaryEnvironment.Moon.ToDto(Lang.Current), PlanetaryEnvironment.Mars.ToDto(Lang.Current)];
}

public record MissionSummary(string Name, Destination Destination, string Landing, ProbeStatus Status, List<ProbeRef> Probes);
public record ProbeRef(string Id, string Name);
