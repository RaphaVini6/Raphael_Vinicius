using Backend.Clients;
using Backend.Localization;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

// Narration for blind users (text, or audio through api-2-speech)
[ApiController]
[Route("api/audio")]
public class AudioController(SpeechClient speech, DataStore store, NarrationService narration, SimulationService sim,
    ILogger<AudioController> log) : ControllerBase
{
    [HttpPost("speak")]
    public async Task<IActionResult> Speak(SpeakRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Text)) return BadRequest(new { error = Messages.Get("err.emptyText", Lang.Current) });
        return await Audio(req.Text, req.Rate, ct);
    }

    [HttpGet("probes/{id}/text")]
    public ActionResult<NarrationText> ProbeText(string id) =>
        store.Probe(id) is { } p ? new NarrationText(narration.Probe(p, Lang.Current), Lang.Current) : NotFound();

    [HttpGet("probes/{id}")]
    public async Task<IActionResult> Probe(string id, int? rate, CancellationToken ct) =>
        store.Probe(id) is { } p ? await Audio(narration.Probe(p, Lang.Current), rate, ct) : NotFound();

    [HttpPost("simulation/text")]
    public ActionResult<NarrationText> SimulationText(SimulationRequest req)
    {
        try { return new NarrationText(NarrateSimulation(req), Lang.Current); }
        catch (ArgumentException e) { return BadRequest(new { error = e.Message }); }
    }

    [HttpPost("simulation")]
    public async Task<IActionResult> Simulation(SimulationRequest req, int? rate, CancellationToken ct)
    {
        string text;
        try { text = NarrateSimulation(req); }
        catch (ArgumentException e) { return BadRequest(new { error = e.Message }); }
        return await Audio(text, rate, ct);
    }

    private string NarrateSimulation(SimulationRequest req)
    {
        var lang = Lang.Current;
        var result = sim.Simulate(req, lang);
        return narration.Simulation(store.Probe(req.ProbeId)!, result, lang);
    }

    private async Task<IActionResult> Audio(string text, int? rate, CancellationToken ct)
    {
        var lang = Lang.Current;
        try
        {
            var audio = await speech.SpeakAsync(text, lang, rate, ct);
            if (audio.Engine is not null) Response.Headers["X-Speech-Engine"] = audio.Engine;
            return File(audio.Data, audio.ContentType);
        }
        catch (Exception e)
        {
            log.LogWarning(e, "Speech API call failed (lang {Lang})", lang);
            // the front end can still read this text with the browser's speech synthesis
            return StatusCode(502, new { error = Messages.Get("err.speechUnavailable", lang), text, language = lang });
        }
    }
}

public record SpeakRequest(string Text, int? Rate);
public record NarrationText(string Text, string Language);
