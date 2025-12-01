using FluentValidation;
using TaskScope.BLL.Models.Dtos.Tags;

namespace TaskScope.BLL.Validators.Tags;

public class UpdateTagDtoValidator : AbstractValidator<UpdateTagDto>
{
    public UpdateTagDtoValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Tag ID is required");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tag name is required")
            .MaximumLength(20)
            .WithMessage("Tag name cannot exceed 20 characters");

        RuleFor(x => x.Color)
            .Matches(@"^#[0-9A-Fa-f]{6}$")
            .WithMessage("Color must be a valid hex color code (e.g., #FF5733)")
            .When(x => !string.IsNullOrEmpty(x.Color));
    }
}
