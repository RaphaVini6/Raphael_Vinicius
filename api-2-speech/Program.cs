using Api2.Speech;
using Scalar.AspNetCore;

// TTS for blind users. Engines are tried in order: Knowlez -> Azure -> Windows.
// Results are cached in audio-cache/ (the Knowlez trial only has 50 requests).

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

builder.Services.AddHttpClient<KnowlezSpeechSynthesizer>(c =>
{
    c.BaseAddress = new Uri(builder.Configuration["Speech:Knowlez:BaseUrl"] ?? "https://api-tts.knowlez.com");
    c.Timeout = TimeSpan.FromSeconds(60);
});
builder.Services.AddHttpClient<AzureSpeechSynthesizer>(c => c.Timeout = TimeSpan.FromSeconds(30));

// order matters (fallback)
builder.Services.AddSingleton<ISpeechSynthesizer>(sp => sp.GetRequiredService<KnowlezSpeechSynthesizer>());
builder.Services.AddSingleton<ISpeechSynthesizer>(sp => sp.GetRequiredService<AzureSpeechSynthesizer>());
if (OperatingSystem.IsWindows())
    builder.Services.AddSingleton<ISpeechSynthesizer, WindowsSpeechSynthesizer>();
builder.Services.AddSingleton<FallbackSpeechSynthesizer>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapGet("/api/health", (FallbackSpeechSynthesizer tts, KnowlezSpeechSynthesizer knowlez, AzureSpeechSynthesizer azure) =>
    Results.Ok(new
    {
        status = "ok",
        service = "api-2-speech",
        engines = tts.Engines,
        knowlezConfigured = knowlez.IsConfigured,
        azureConfigured = azure.IsConfigured,
    }));

app.MapGet("/api/usage", async (KnowlezSpeechSynthesizer knowlez, CancellationToken ct) =>
    await knowlez.UsageAsync(ct) is { } usage ? Results.Content(usage, "application/json") : Results.NotFound());

app.MapGet("/api/voices", (FallbackSpeechSynthesizer tts) =>
{
    var voices = tts.Voices().ToList();
    var supported = new[] { "en", "pt", "es", "fr" };
    return Results.Ok(new
    {
        voices,
        languages = supported.ToDictionary(l => l, l => voices.Any(v => v.Language.StartsWith(l, StringComparison.OrdinalIgnoreCase))),
    });
});

// returns audio/mpeg or audio/wav, X-Speech-Engine says which engine answered
app.MapPost("/api/speech", async (SpeechRequest req, FallbackSpeechSynthesizer tts, IConfiguration cfg, HttpContext http, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(req.Text))
        return Results.BadRequest(new { error = "Text is empty." });

    var maxChars = cfg.GetValue("Speech:MaxCharacters", 4000);
    if (req.Text.Length > maxChars)
        return Results.BadRequest(new { error = $"Text is longer than {maxChars} characters." });

    var language = string.IsNullOrWhiteSpace(req.Language) ? "en" : req.Language;
    var rate = Math.Clamp(req.Rate ?? cfg.GetValue("Speech:DefaultRate", 0), -10, 10);

    if (await tts.SynthesizeAsync(req.Text, language, rate, req.Voice, ct) is not { } result)
        return Results.UnprocessableEntity(new { error = $"No voice available for language '{language}'.", language });

    http.Response.Headers["X-Speech-Engine"] = result.Engine;
    return Results.File(result.Audio.Data, result.Audio.ContentType);
});

app.Run();

record SpeechRequest(string Text, string? Language, int? Rate, string? Voice);
