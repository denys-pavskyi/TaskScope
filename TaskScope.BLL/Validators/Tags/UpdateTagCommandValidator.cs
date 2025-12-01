using FluentValidation;
using TaskScope.BLL.MediatR.Tags.Update;

namespace TaskScope.BLL.Validators.Tags;

public class UpdateTagCommandValidator : AbstractValidator<UpdateTagCommand>
{
    public UpdateTagCommandValidator(UpdateTagDtoValidator dtoValidator)
    {
        RuleFor(x => x.NewTag)
            .NotNull()
            .WithMessage("Tag cannot be null");

        When(x => x.NewTag != null, () =>
        {
            RuleFor(x => x.NewTag)
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
