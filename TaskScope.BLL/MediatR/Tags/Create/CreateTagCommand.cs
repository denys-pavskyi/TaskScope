using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tags;

namespace TaskScope.BLL.MediatR.Tags.Create;

public record CreateTagCommand(TagDto NewTag) : IRequest<Result<TagDto>>;