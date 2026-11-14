using System.Net.Http.Json;

namespace Backend.Clients;

public class VLibrasClient(HttpClient http)
{
    public async Task<LibrasTranslation?> TranslateAsync(string text, CancellationToken ct = default)
    {
        var resp = await http.PostAsJsonAsync("/api/translate", new { text }, ct);
        resp.EnsureSuccessStatusCode();
        return await resp.Content.ReadFromJsonAsync<LibrasTranslation>(ct);
    }

    public async Task<bool> IsOnlineAsync(CancellationToken ct = default)
    {
        try { return (await http.GetAsync("/api/health", ct)).IsSuccessStatusCode; }
        catch { return false; }
    }
}

public record LibrasTranslation(string Text, string Gloss);
