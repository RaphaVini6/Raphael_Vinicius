using Backend.Clients;
using Backend.Localization;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

// VLibras only understands Portuguese, so we always send the pt text
[ApiController]
[Route("api/libras")]
public class LibrasController(VLibrasClient vlibras, DataStore store, ILogger<LibrasController> log) : ControllerBase
{
    [HttpPost("translate")]
    public async Task<IActionResult> Translate(TranslateRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Text)) return BadRequest(new { error = Messages.Get("err.emptyText", Lang.Current) });
        try { return Ok(await vlibras.TranslateAsync(req.Text, ct)); }
        catch (Exception e)
        {
            log.LogWarning(e, "VLibras API call failed");
            return StatusCode(502, new { error = Messages.Get("err.librasUnavailable", Lang.Current) });
        }
    }

    [HttpGet("probes/{id}")]
    public async Task<IActionResult> TranslateProbe(string id, CancellationToken ct)
    {
        if (store.Probe(id) is not { } p) return NotFound();
        return await Translate(new TranslateRequest($"{p.Name.Get("pt")}. {p.Function.Get("pt")}"), ct);
    }
}

public record TranslateRequest(string Text);
