using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskScope.BLL.MediatR.Tags.Create;
using TaskScope.BLL.MediatR.Tags.Delete;
using TaskScope.BLL.MediatR.Tags.GetAll;
using TaskScope.BLL.MediatR.Tags.Update;
using TaskScope.BLL.MediatR.Tasks.Create;
using TaskScope.BLL.MediatR.Tasks.Delete;
using TaskScope.BLL.MediatR.Tasks.GetAll;
using TaskScope.BLL.MediatR.Tasks.Update;

namespace TaskScope.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : BaseApiController
    {

        [HttpGet]
        public async Task<IActionResult> GetAll(
            CancellationToken cancellationToken)
        {
            var query = new GetAllTagsQuery();
            var result = await Mediator.Send(query, cancellationToken);
            var resultValue = result.ValueOrDefault;

            if (resultValue is null || !resultValue.Any())
                return NoContent();

            return Ok(resultValue);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTagCommand command,
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

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateTagCommand command,
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

        [HttpDelete]
        [HttpGet("tag/{taskId:guid}")]
        public async Task<IActionResult> Delete(Guid TagId,
            CancellationToken cancellationToken)
        {
            var command = new DeleteTagCommand(TagId);

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
