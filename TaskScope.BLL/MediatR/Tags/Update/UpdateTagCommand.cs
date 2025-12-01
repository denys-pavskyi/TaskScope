using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tags;

namespace TaskScope.BLL.MediatR.Tags.Update;

public record UpdateTagCommand(UpdateTagDto NewTag) : IRequest<Result<TagDto>>;