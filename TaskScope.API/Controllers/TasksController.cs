using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskScope.BLL.MediatR.Tasks.Create;
using TaskScope.BLL.MediatR.Tasks.GetAllByUserId;
using TaskScope.BLL.MediatR.Tasks.GetTaskById;
using TaskScope.BLL.MediatR.Tasks.GetTasksByTag;

namespace TaskScope.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : BaseApiController
    {
        [HttpGet("user/{userId:guid}")]
        public async Task<IActionResult> GetByUserId(
            Guid userId,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            CancellationToken cancellationToken)
        {
            var query = new GetTasksByUserIdQuery(userId, startDate, endDate);
            var result = await Mediator.Send(query, cancellationToken);
            var resultValue = result.ValueOrDefault;

            if (resultValue is null || !resultValue.Any())
                return NoContent();

            return Ok(resultValue);
        }

        [HttpGet("{taskId:guid}")]
        public async Task<IActionResult> GetById(Guid taskId, CancellationToken cancellationToken)
        {
            var query = new GetTaskByIdQuery(taskId);
            var result = await Mediator.Send(query, cancellationToken);
            var resultValue = result.ValueOrDefault;

            if (result.IsFailed || resultValue == null)
            {
                return NotFound();
            }

            return Ok(resultValue);
        }

        [HttpGet("tag/{tagId:guid}/user/{userId:guid}")]
        public async Task<IActionResult> GetByTag(Guid tagId, Guid userId, CancellationToken cancellationToken)
        {
            var query = new GetTasksByTagQuery(userId, tagId);
            var result = await Mediator.Send(query, cancellationToken);
            var resultValue = result.ValueOrDefault;

            if (resultValue is null || !resultValue.Any())
            {
                return NoContent();
            }

            return Ok(resultValue);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTaskCommand command,
            CancellationToken cancellationToken)
        {
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
