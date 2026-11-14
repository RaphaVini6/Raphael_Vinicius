using System.Text.Json.Serialization;
using Backend.Clients;
using Backend.Localization;
using Backend.Services;
using Microsoft.AspNetCore.Localization;
using Scalar.AspNetCore;

// load the nearest .env (repo root) without overriding real environment variables
DotNetEnv.Env.NoClobber().TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApi();

builder.Services.AddSingleton<DataStore>();
builder.Services.AddSingleton<SimulationService>();
builder.Services.AddSingleton<NarrationService>();

// language: ?lang= > Accept-Language > en
builder.Services.AddRequestLocalization(o =>
{
    o.SetDefaultCulture(Lang.Default)
     .AddSupportedCultures(Lang.Supported)
     .AddSupportedUICultures(Lang.Supported);
    o.RequestCultureProviders.Insert(0, new QueryStringRequestCultureProvider { QueryStringKey = "lang", UIQueryStringKey = "lang" });
});

// other services (urls in appsettings)
builder.Services.AddHttpClient<VLibrasClient>(c =>
{
    c.BaseAddress = new Uri(builder.Configuration["Apis:VLibras:BaseUrl"]!);
    c.Timeout = TimeSpan.FromSeconds(15);
});
builder.Services.AddHttpClient<SpeechClient>(c =>
{
    c.BaseAddress = new Uri(builder.Configuration["Apis:Speech:BaseUrl"]!);
    c.Timeout = TimeSpan.FromSeconds(60);
});

builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? [])
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // /scalar
}

app.UseRequestLocalization();
app.UseCors();
app.MapControllers();

app.Run();
