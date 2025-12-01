using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskScope.BLL.MediatR.Tasks.Create;
using TaskScope.BLL.MediatR.Tasks.Delete;
using TaskScope.BLL.MediatR.Tasks.GetAll;
using TaskScope.BLL.MediatR.Tasks.GetTaskById;
using TaskScope.BLL.MediatR.Tasks.GetTasksByTag;
using TaskScope.BLL.MediatR.Tasks.Update;
using TaskScope.BLL.MediatR.Tasks.GetTodayAndOverdueGroupedByStatus;
using TaskScope.BLL.MediatR.Tasks.UpdateTaskStatus;
using TaskScope.DAL.Enums;

namespace TaskScope.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            CancellationToken cancellationToken)
        {
            var query = new GetAllTasksQuery(startDate, endDate);
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

        [HttpGet("tag/{tagId:guid}")]
        public async Task<IActionResult> GetByTag(Guid tagId, CancellationToken cancellationToken)
        {
            var query = new GetTasksByTagQuery(tagId);
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

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateTaskCommand command,
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
        public async Task<IActionResult> Delete(Guid TaskId,
            CancellationToken cancellationToken)
        {
            var command = new DeleteTaskCommand(TaskId);
            
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

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayAndOverdueGroupedByStatus(CancellationToken cancellationToken)
        {
            var query = new GetTodayAndOverdueTasksGroupedByStatusQuery();
            var result = await Mediator.Send(query, cancellationToken);
            var resultValue = result.ValueOrDefault;

            if (resultValue == null || !resultValue.Any())
                return NoContent();

            return Ok(resultValue);
        }

        [HttpPatch("updateStatus")]
        public async Task<IActionResult> UpdateTaskStatus(Guid taskId, TaskEntityStatus newStatus, CancellationToken cancellationToken)
        {
            var command = new UpdateTaskStatusCommand(taskId, newStatus);
            
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
