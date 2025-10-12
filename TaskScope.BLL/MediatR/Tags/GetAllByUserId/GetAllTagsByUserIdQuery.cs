using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tags;

namespace TaskScope.BLL.MediatR.Tags.GetAll;

public record GetAllTagsByUserIdQuery(Guid UserId) : IRequest<Result<IEnumerable<TagDto>>>;