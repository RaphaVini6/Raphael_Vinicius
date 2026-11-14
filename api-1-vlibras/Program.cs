using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.Caching.Memory;
using Scalar.AspNetCore;

// Proxy for the VLibras translator (Portuguese -> Libras gloss). Docs: https://www.gov.br/conecta/catalogo/apis/vlibras

// load the nearest .env (repo root) without overriding real environment variables
DotNetEnv.Env.NoClobber().TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
builder.Services.AddMemoryCache();

builder.Services.AddHttpClient("vlibras", (sp, c) =>
{
    var cfg = sp.GetRequiredService<IConfiguration>();
    c.BaseAddress = new Uri(cfg["VLibras:BaseUrl"]!);
    c.Timeout = TimeSpan.FromSeconds(20);
    // VLibras answers 403 when the request has no User-Agent.
    c.DefaultRequestHeaders.UserAgent.ParseAdd("NasaHackathon-Api1/1.0");
    // video and /signs need a Conecta token
    if (cfg["VLibras:Token"] is { Length: > 0 } token)
        c.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", service = "api-1-vlibras" }));

// VLibras only understands Portuguese
app.MapPost("/api/translate", async (TranslateRequest req, IHttpClientFactory factory, IMemoryCache cache, ILogger<Program> log) =>
{
    if (string.IsNullOrWhiteSpace(req.Text))
        return Results.BadRequest(new { error = "Text is empty." });

    var text = req.Text.Trim();
    if (cache.TryGetValue(text, out string? cachedGloss))
        return Results.Ok(new TranslateResponse(text, cachedGloss!));

    // GET /translate returns 401, POST with JSON works without a token
    var resp = await factory.CreateClient("vlibras").PostAsJsonAsync("/translate", new { text });
    if (!resp.IsSuccessStatusCode)
    {
        log.LogWarning("VLibras returned {Status}", resp.StatusCode);
        return Results.Problem($"VLibras returned {(int)resp.StatusCode}", statusCode: 502);
    }

    var gloss = (await resp.Content.ReadAsStringAsync()).Trim().Trim('"');
    cache.Set(text, gloss, TimeSpan.FromHours(6));
    return Results.Ok(new TranslateResponse(text, gloss));
});

app.Run();

record TranslateRequest(string Text);
record TranslateResponse(string Text, string Gloss);
