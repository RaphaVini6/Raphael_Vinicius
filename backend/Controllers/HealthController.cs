using Backend.Clients;
using Backend.Localization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController(VLibrasClient vlibras, SpeechClient speech) : ControllerBase
{
    [HttpGet]
    public async Task<object> Get(CancellationToken ct) => new
    {
        backend = "ok",
        language = Lang.Current,
        api1VLibras = await vlibras.IsOnlineAsync(ct) ? "ok" : "offline",
        api2Speech = await speech.IsOnlineAsync(ct) ? "ok" : "offline",
    };
}
