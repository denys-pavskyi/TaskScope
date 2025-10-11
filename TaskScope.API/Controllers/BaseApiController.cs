using FluentResults;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace TaskScope.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class BaseApiController : ControllerBase
{
    private IMediator? _mediator;

    protected IMediator Mediator => _mediator ??=
        HttpContext.RequestServices.GetService<IMediator>()!;
}