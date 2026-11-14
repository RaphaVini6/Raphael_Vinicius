using Backend.Localization;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/simulation")]
public class SimulationController(SimulationService sim) : ControllerBase
{
    [HttpPost]
    public ActionResult<SimulationResult> Simulate(SimulationRequest req)
    {
        try { return sim.Simulate(req, Lang.Current); }
        catch (ArgumentException e) { return BadRequest(new { error = e.Message }); }
    }

    [HttpGet("{probeId}/original")]
    public ActionResult<SimulationResult> Original(string probeId) => Simulate(new SimulationRequest { ProbeId = probeId });
}
