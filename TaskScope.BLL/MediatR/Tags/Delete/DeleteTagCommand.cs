using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tags;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tags.Delete;

public record DeleteTagCommand(Guid Id) : IRequest<Result<TagDto>>;