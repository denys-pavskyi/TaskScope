using FluentValidation;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.Validators.Tasks;

public class CreateTaskDtoValidator : AbstractValidator<CreateTaskDto>
{
    public CreateTaskDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Task title is required")
            .MaximumLength(200)
            .WithMessage("Task title cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(2000)
            .WithMessage("Task description cannot exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Priority)
            .IsInEnum()
            .WithMessage("Invalid task priority");

        RuleFor(x => x.Status)
            .IsInEnum()
            .WithMessage("Invalid task status");

        RuleFor(x => x.DueDate)
            .GreaterThan(DateTime.Now)
            .WithMessage("Due date must be in the future")
            .When(x => x.DueDate.HasValue);
    }
}
