using Backend.Localization;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

// teaching content: historical precedents, classroom methodology, robotics background
[ApiController]
[Route("api/learn")]
public class LearnController(DataStore store) : ControllerBase
{
    [HttpGet]
    public object Get() => store.Learn.ToDto(Lang.Current);

    // probes that have a robotics classroom application (Viking 1, LRV, InSight, Ingenuity)
    [HttpGet("robotics-cases")]
    public IEnumerable<object> RoboticsCases()
    {
        var lang = Lang.Current;
        return store.Probes
            .Where(p => p.RoboticsApplication is not null)
            .Select(p => new
            {
                p.Id,
                Name = p.Name.Get(lang),
                p.Destination,
                Location = p.Location.Get(lang),
                KeyComponents = p.KeyComponents?.Get(lang),
                Application = p.RoboticsApplication!.Get(lang),
                p.ImageUrl,
            });
    }
}
