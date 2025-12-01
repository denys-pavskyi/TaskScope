using FluentValidation;
using TaskScope.BLL.MediatR.Tasks.UpdateTaskStatus;
using TaskScope.DAL.Enums;

namespace TaskScope.BLL.Validators.Tasks;

public class UpdateTaskStatusCommandValidator : AbstractValidator<UpdateTaskStatusCommand>
{
    public UpdateTaskStatusCommandValidator()
    {
        RuleFor(x => x.TaskId)
            .NotEmpty()
            .WithMessage("Task ID is required");

        RuleFor(x => x.NewStatus)
            .IsInEnum()
            .WithMessage("Invalid task status");
    }
}
