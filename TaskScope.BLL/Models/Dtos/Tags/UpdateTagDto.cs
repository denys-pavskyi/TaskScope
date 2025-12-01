namespace TaskScope.BLL.Models.Dtos.Tags;

public class UpdateTagDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Color { get; set; }
}
