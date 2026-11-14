using System.Runtime.Versioning;
using System.Speech.Synthesis;

namespace Api2.Speech;

public interface ISpeechSynthesizer
{
    string Engine { get; }
    IEnumerable<VoiceDescription> Voices();

    // returns null if the engine has no key or no voice for the language (next engine is tried)
    Task<SpeechAudio?> SynthesizeAsync(string text, string language, int rate, string? voice, CancellationToken ct);
}

public record VoiceDescription(string Name, string Language, string Engine);

public record SpeechAudio(byte[] Data, string ContentType);

[SupportedOSPlatform("windows")]
public class WindowsSpeechSynthesizer(IConfiguration cfg) : ISpeechSynthesizer
{
    public string Engine => "Windows SAPI";

    public IEnumerable<VoiceDescription> Voices()
    {
        using var s = new SpeechSynthesizer();
        return Installed(s)
            .Select(v => new VoiceDescription(v.Name ?? "", v.Culture?.Name ?? "", Engine))
            .ToList();
    }

    public Task<SpeechAudio?> SynthesizeAsync(string text, string language, int rate, string? voice, CancellationToken ct) =>
        Task.Run(() =>
        {
            // SpeechSynthesizer is not thread-safe: one instance per request.
            using var s = new SpeechSynthesizer();
            var installed = Installed(s);
            bool Matches(VoiceInfo v) => v.Culture?.Name.StartsWith(language, StringComparison.OrdinalIgnoreCase) == true;

            // Requested voice > preferred voice from config > any voice for the language
            var preferred = voice ?? cfg[$"Speech:Windows:PreferredVoices:{language.Split('-')[0]}"];
            var chosen = installed.FirstOrDefault(v => string.Equals(v.Name, preferred, StringComparison.OrdinalIgnoreCase) && Matches(v))
                         ?? installed.FirstOrDefault(Matches);
            if (chosen?.Name is not { } name) return null;

            s.SelectVoice(name);
            s.Rate = rate;

            using var ms = new MemoryStream();
            s.SetOutputToWaveStream(ms);
            var prompt = new PromptBuilder(chosen.Culture!);
            prompt.AppendText(text);
            s.Speak(prompt);
            s.SetOutputToNull();
            return new SpeechAudio(ms.ToArray(), "audio/wav");
        }, ct);

    private static List<VoiceInfo> Installed(SpeechSynthesizer s) =>
        s.GetInstalledVoices().Where(v => v.Enabled).Select(v => v.VoiceInfo).OfType<VoiceInfo>().ToList();
}
