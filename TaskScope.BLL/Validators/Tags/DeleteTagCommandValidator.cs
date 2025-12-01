using FluentValidation;
using TaskScope.BLL.MediatR.Tags.Delete;

namespace TaskScope.BLL.Validators.Tags;

public class DeleteTagCommandValidator : AbstractValidator<DeleteTagCommand>
{
    public DeleteTagCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Tag ID is required");
    }
}
