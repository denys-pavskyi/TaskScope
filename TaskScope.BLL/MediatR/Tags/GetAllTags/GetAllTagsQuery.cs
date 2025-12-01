using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tags;

namespace TaskScope.BLL.MediatR.Tags.GetAll;

public record GetAllTagsQuery() : IRequest<Result<IEnumerable<TagDto>>>;