using Backend.Localization;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/hardware")]
public class HardwareController(DataStore store) : ControllerBase
{
    [HttpGet]
    public IEnumerable<HardwareComponent> List(HardwareCategory? category) =>
        store.Components.Where(c => category is null || c.Category == category).Select(c => c.ToDto(Lang.Current));

    [HttpGet("by-category")]
    public Dictionary<HardwareCategory, List<HardwareComponent>> ByCategory() =>
        store.Components.GroupBy(c => c.Category).ToDictionary(g => g.Key, g => g.Select(c => c.ToDto(Lang.Current)).ToList());

    [HttpGet("{id}")]
    public ActionResult<HardwareComponent> Get(string id) => store.Component(id) is { } c ? c.ToDto(Lang.Current) : NotFound();
}
