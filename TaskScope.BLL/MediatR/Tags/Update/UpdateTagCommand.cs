using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tags;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tags.Update;

public record UpdateTagCommand(TagDto NewTag) : IRequest<Result<TagDto>>;