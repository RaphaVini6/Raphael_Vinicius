using System.Security.Cryptography;
using System.Text;

namespace Api2.Speech;

// tries each engine in order, caches the audio on disk
public class FallbackSpeechSynthesizer
{
    private readonly List<ISpeechSynthesizer> _engines;
    private readonly ILogger<FallbackSpeechSynthesizer> _log;
    private readonly string _cacheDir;

    public FallbackSpeechSynthesizer(IEnumerable<ISpeechSynthesizer> engines, IConfiguration cfg, IWebHostEnvironment env,
        ILogger<FallbackSpeechSynthesizer> log)
    {
        _engines = engines.ToList();
        _log = log;
        _cacheDir = Path.Combine(env.ContentRootPath, cfg["Speech:CacheDir"] ?? "audio-cache");
        Directory.CreateDirectory(_cacheDir);
    }

    public string Engines => string.Join(" > ", _engines.Select(e => e.Engine));

    public IEnumerable<VoiceDescription> Voices() => _engines.SelectMany(e => e.Voices());

    public async Task<(SpeechAudio Audio, string Engine)?> SynthesizeAsync(string text, string language, int rate, string? voice, CancellationToken ct)
    {
        var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes($"{language}|{rate}|{voice}|{text}")))[..32];

        // Cache hit: <hash>.mp3 or <hash>.wav
        foreach (var (ext, type) in new[] { ("mp3", "audio/mpeg"), ("wav", "audio/wav") })
        {
            var cached = Path.Combine(_cacheDir, $"{hash}.{ext}");
            if (File.Exists(cached)) return (new SpeechAudio(await File.ReadAllBytesAsync(cached, ct), type), "cache");
        }

        foreach (var engine in _engines)
        {
            try
            {
                if (await engine.SynthesizeAsync(text, language, rate, voice, ct) is not { } audio) continue;
                var ext = audio.ContentType == "audio/mpeg" ? "mp3" : "wav";
                await File.WriteAllBytesAsync(Path.Combine(_cacheDir, $"{hash}.{ext}"), audio.Data, ct);
                return (audio, engine.Engine);
            }
            catch (Exception e) when (e is not OperationCanceledException)
            {
                _log.LogWarning(e, "Engine {Engine} failed, trying the next one", engine.Engine);
            }
        }
        return null;
    }
}
