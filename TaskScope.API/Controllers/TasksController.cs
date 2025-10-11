using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskScope.BLL.MediatR.Tasks.GetAllByUserId;

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

    }
}
