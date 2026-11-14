using System.Globalization;

namespace Backend.Localization;

public class LocalizedText : Dictionary<string, string>
{
    public LocalizedText() : base(StringComparer.OrdinalIgnoreCase) { }

    public string Get(string lang) =>
        TryGetValue(lang, out var value) && !string.IsNullOrWhiteSpace(value) ? value
        : TryGetValue(Lang.Default, out var en) ? en
        : Values.FirstOrDefault() ?? "";
}

public static class Lang
{
    public const string Default = "en";
    public static readonly string[] Supported = ["en", "pt", "es", "fr"];

    public static string Current
    {
        get
        {
            var lang = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
            return Supported.Contains(lang) ? lang : Default;
        }
    }

    public static CultureInfo Culture(string lang) => CultureInfo.GetCultureInfo(lang == "pt" ? "pt-BR" : lang);
}
