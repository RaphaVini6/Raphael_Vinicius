using Backend.Localization;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/probes")]
public class ProbesController(DataStore store) : ControllerBase
{
    [HttpGet]
    public IEnumerable<Probe> List(Destination? destination, ProbeStatus? status, ProbeType? type, string? search)
    {
        var lang = Lang.Current;
        var probes = store.Probes
            .Where(p => destination is null || p.Destination == destination)
            .Where(p => status is null || p.Status == status)
            .Where(p => type is null || p.Type == type)
            .Select(p => p.ToDto(lang));

        if (!string.IsNullOrWhiteSpace(search))
            probes = probes.Where(p => $"{p.Name} {p.Mission} {p.Function} {p.Location}".Contains(search, StringComparison.OrdinalIgnoreCase));
        return probes;
    }

    [HttpGet("{id}")]
    public ActionResult<Probe> Get(string id) => store.Probe(id) is { } p ? p.ToDto(Lang.Current) : NotFound();

    [HttpGet("{id}/hardware")]
    public ActionResult<Dictionary<HardwareCategory, HardwareComponent?>> Hardware(string id)
    {
        if (store.Probe(id) is not { } p) return NotFound();
        return p.RealHardware.ToDictionary(kv => kv.Key, kv => store.Component(kv.Value)?.ToDto(Lang.Current));
    }
}
