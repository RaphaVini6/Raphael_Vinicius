using System.Text.Json;
using System.Text.Json.Serialization;
using Backend.Models;

namespace Backend.Services;

// Loads Data/*.json in memory. TODO: move to a database if the data grows.
public class DataStore
{
    public static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() },
    };

    public IReadOnlyList<ProbeData> Probes { get; }
    public IReadOnlyList<ComponentData> Components { get; }
    public LearnData Learn { get; }

    public DataStore(IWebHostEnvironment env)
    {
        var dir = Path.Combine(env.ContentRootPath, "Data");
        // probes are split by destination: probes.moon.json, probes.mars.json, ...
        Probes = Directory.GetFiles(dir, "probes.*.json").Order()
            .SelectMany(f => Read<List<ProbeData>>(f))
            .OrderBy(p => p.Destination).ThenBy(p => p.Date)
            .ToList();
        Components = Read<List<ComponentData>>(Path.Combine(dir, "components.json"));
        Learn = Read<LearnData>(Path.Combine(dir, "learn.json"));
    }

    public ProbeData? Probe(string id) => Probes.FirstOrDefault(p => p.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    public ComponentData? Component(string id) => Components.FirstOrDefault(c => c.Id.Equals(id, StringComparison.OrdinalIgnoreCase));

    private static T Read<T>(string path) =>
        JsonSerializer.Deserialize<T>(File.ReadAllText(path), JsonOptions)
        ?? throw new InvalidOperationException($"Could not read {path}");
}
