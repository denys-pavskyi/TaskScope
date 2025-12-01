using Microsoft.AspNetCore.Mvc;
using TaskScope.BLL.MediatR.TaskEntityTags.Create;
using TaskScope.BLL.MediatR.TaskEntityTags.Delete;

namespace TaskScope.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskEntityTagController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTaskEntityTagCommand command,
            CancellationToken cancellationToken)
        {
            var validationError = await ValidateRequestAsync(command, cancellationToken);
            if (validationError != null)
                return validationError;

            var result = await Mediator.Send(command, cancellationToken);
            var resultValue = result.ValueOrDefault;
            if (result.IsFailed || resultValue == null)
            {
                return BadRequest(result.Errors);
            }

            return Ok(resultValue);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(Guid taskId, Guid tagId,
            CancellationToken cancellationToken)
        {
            var command = new DeleteTaskEntityTagCommand(taskId, tagId);

            var validationError = await ValidateRequestAsync(command, cancellationToken);
            if (validationError != null)
                return validationError;

            var result = await Mediator.Send(command, cancellationToken);
            var resultValue = result.ValueOrDefault;
            if (result.IsFailed || resultValue == null)
            {
                return BadRequest(result.Errors);
            }

            return Ok(resultValue);
        }
    }
}
