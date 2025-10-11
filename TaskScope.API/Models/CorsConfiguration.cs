namespace TaskScope.API.Models;

public class CorsConfiguration
{
    public string[] AllowedOrigins { get; set; }
    public string[] AllowedHeaders { get; set; }
    public string[] AllowedMethods { get; set; }
    public int PreflightMaxAge { get; set; }
}