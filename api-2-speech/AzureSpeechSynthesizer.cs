using System.Security;
using System.Text;

namespace Api2.Speech;

// optional, only used if Speech:Azure:Key is set
public class AzureSpeechSynthesizer(HttpClient http, IConfiguration cfg, ILogger<AzureSpeechSynthesizer> log) : ISpeechSynthesizer
{
    public string Engine => "Azure AI Speech";

    private string? Key => cfg["Speech:Azure:Key"];
    private string Region => cfg["Speech:Azure:Region"] ?? "brazilsouth";
    public bool IsConfigured => !string.IsNullOrWhiteSpace(Key);

    public IEnumerable<VoiceDescription> Voices() =>
        IsConfigured
            ? cfg.GetSection("Speech:Azure:Voices").GetChildren()
                .Select(v => new VoiceDescription(v.Value ?? "", Culture(v.Value), Engine))
            : [];

    public async Task<SpeechAudio?> SynthesizeAsync(string text, string language, int rate, string? voice, CancellationToken ct)
    {
        if (!IsConfigured) return null;

        var lang = language.Split('-')[0].ToLowerInvariant();
        var voiceName = voice is { } v && v.EndsWith("Neural", StringComparison.OrdinalIgnoreCase) ? v : cfg[$"Speech:Azure:Voices:{lang}"];
        if (string.IsNullOrWhiteSpace(voiceName)) return null;

        // rate -10..10  ->  -50%..+50%
        var ssml = $"""
            <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="{Culture(voiceName)}">
              <voice name="{voiceName}"><prosody rate="{rate * 5:+0;-0;+0}%">{SecurityElement.Escape(text)}</prosody></voice>
            </speak>
            """;

        using var req = new HttpRequestMessage(HttpMethod.Post, $"https://{Region}.tts.speech.microsoft.com/cognitiveservices/v1")
        {
            Content = new StringContent(ssml, Encoding.UTF8, "application/ssml+xml"),
        };
        req.Headers.Add("Ocp-Apim-Subscription-Key", Key);
        req.Headers.Add("X-Microsoft-OutputFormat", "riff-24khz-16bit-mono-pcm"); // WAV
        req.Headers.UserAgent.ParseAdd("NasaHackathon-Api2/1.0");

        var resp = await http.SendAsync(req, ct);
        if (!resp.IsSuccessStatusCode)
        {
            log.LogWarning("Azure Speech returned {Status} for {Voice}", (int)resp.StatusCode, voiceName);
            return null;
        }
        return new SpeechAudio(await resp.Content.ReadAsByteArrayAsync(ct), "audio/wav");
    }

    // "pt-BR-FranciscaNeural" -> "pt-BR"
    private static string Culture(string? voiceName) =>
        voiceName?.Split('-') is { Length: >= 2 } p ? $"{p[0]}-{p[1]}" : "en-US";
}
