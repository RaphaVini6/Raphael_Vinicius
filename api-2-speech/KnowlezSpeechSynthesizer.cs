using System.Net.Http.Json;

namespace Api2.Speech;

// https://api-tts.knowlez.com/docs - trial plan is only 50 requests, results are cached on disk
public class KnowlezSpeechSynthesizer(HttpClient http, IConfiguration cfg, ILogger<KnowlezSpeechSynthesizer> log) : ISpeechSynthesizer
{
    private const int MaxChars = 4000; // API limit per call

    public string Engine => "Knowlez TTS";

    private string? Key => cfg["Speech:Knowlez:Key"];
    public bool IsConfigured => !string.IsNullOrWhiteSpace(Key);

    public IEnumerable<VoiceDescription> Voices() =>
        IsConfigured
            ? cfg.GetSection("Speech:Knowlez:Voices").GetChildren().Select(v => new VoiceDescription(v.Value ?? "", v.Key, Engine))
            : [];

    public async Task<SpeechAudio?> SynthesizeAsync(string text, string language, int rate, string? voice, CancellationToken ct)
    {
        if (!IsConfigured || text.Length > MaxChars) return null;

        var lang = language.Split('-')[0].ToLowerInvariant();
        var voiceName = cfg[$"Speech:Knowlez:Voices:{lang}"];
        if (string.IsNullOrWhiteSpace(voiceName)) return null;

        // rate -10..10  ->  speed 0.5..1.5 (API accepts 0.5..2.0)
        var speed = Math.Round(1 + rate / 20.0, 2);

        using var req = new HttpRequestMessage(HttpMethod.Post, "/v1/tts/synthesise")
        {
            Content = JsonContent.Create(new { text, voice = voiceName, format = "mp3", speed }),
        };
        req.Headers.Add("X-API-Key", Key);

        var resp = await http.SendAsync(req, ct);
        if (!resp.IsSuccessStatusCode)
        {
            log.LogWarning("Knowlez TTS returned {Status}: {Body}", (int)resp.StatusCode, await resp.Content.ReadAsStringAsync(ct));
            return null;
        }
        return new SpeechAudio(await resp.Content.ReadAsByteArrayAsync(ct), "audio/mpeg");
    }

    public async Task<string?> UsageAsync(CancellationToken ct)
    {
        if (!IsConfigured) return null;
        using var req = new HttpRequestMessage(HttpMethod.Get, "/v1/usage");
        req.Headers.Add("X-API-Key", Key);
        var resp = await http.SendAsync(req, ct);
        return await resp.Content.ReadAsStringAsync(ct);
    }
}
