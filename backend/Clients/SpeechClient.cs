using System.Net.Http.Json;

namespace Backend.Clients;

public class SpeechClient(HttpClient http)
{
    public async Task<SpeechAudio> SpeakAsync(string text, string language, int? rate = null, CancellationToken ct = default)
    {
        var resp = await http.PostAsJsonAsync("/api/speech", new { text, language, rate }, ct);
        resp.EnsureSuccessStatusCode();
        var contentType = resp.Content.Headers.ContentType?.MediaType ?? "audio/wav";
        var engine = resp.Headers.TryGetValues("X-Speech-Engine", out var v) ? v.FirstOrDefault() : null;
        return new SpeechAudio(await resp.Content.ReadAsByteArrayAsync(ct), contentType, engine);
    }

    public async Task<bool> IsOnlineAsync(CancellationToken ct = default)
    {
        try { return (await http.GetAsync("/api/health", ct)).IsSuccessStatusCode; }
        catch { return false; }
    }
}

public record SpeechAudio(byte[] Data, string ContentType, string? Engine);
