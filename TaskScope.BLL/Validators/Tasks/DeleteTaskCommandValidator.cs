using FluentValidation;
using TaskScope.BLL.MediatR.Tasks.Delete;

namespace TaskScope.BLL.Validators.Tasks;

public class DeleteTaskCommandValidator : AbstractValidator<DeleteTaskCommand>
{
    public DeleteTaskCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Task ID is required");
    }
}
