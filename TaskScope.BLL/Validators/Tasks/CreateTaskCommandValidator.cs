using FluentValidation;
using TaskScope.BLL.MediatR.Tasks.Create;

namespace TaskScope.BLL.Validators.Tasks;

public class CreateTaskCommandValidator : AbstractValidator<CreateTaskCommand>
{
    public CreateTaskCommandValidator(CreateTaskDtoValidator dtoValidator)
    {
        RuleFor(x => x.NewTask)
            .NotNull()
            .WithMessage("Task cannot be null");

        When(x => x.NewTask != null, () =>
        {
            RuleFor(x => x.NewTask)
                .Custom((dto, context) =>
                {
                    var result = dtoValidator.Validate(dto);
                    foreach (var error in result.Errors)
                    {
                        context.AddFailure(error);
                    }
                });
        });
    }
}
