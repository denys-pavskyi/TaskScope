using FluentResults;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace TaskScope.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class BaseApiController : ControllerBase
{
    private IMediator? _mediator;
    private IServiceProvider? _serviceProvider;

    protected IMediator Mediator => _mediator ??=
        HttpContext.RequestServices.GetService<IMediator>()!;

    protected IServiceProvider ServiceProvider => _serviceProvider ??=
        HttpContext.RequestServices;

    protected async Task<IActionResult?> ValidateRequestAsync<TRequest>(
        TRequest request,
        CancellationToken cancellationToken)
        where TRequest : notnull
    {
        var validatorType = typeof(IValidator<>).MakeGenericType(typeof(TRequest));
        var validator = ServiceProvider.GetService(validatorType) as IValidator<TRequest>;

        if (validator is null)
            return null; // No validator registered, skip validation

        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(new
            {
                error = "One or more validation errors occurred.",
                statusCode = 400,
                traceId = HttpContext.TraceIdentifier,
                errors = errors
            });
        }

        return null; // Validation passed
    }
}