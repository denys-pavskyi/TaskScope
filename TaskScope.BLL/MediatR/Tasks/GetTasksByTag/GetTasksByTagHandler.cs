using AutoMapper;
using FluentResults;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tasks.GetTasksByTag;

public class GetTasksByTagHandler : IRequestHandler<GetTasksByTagQuery, Result<IEnumerable<TaskEntityDto>>>
{
    private readonly IRepositoryWrapper _repositoryWrapper;
    private readonly IMapper _mapper;

    public GetTasksByTagHandler(IRepositoryWrapper repositoryWrapper, IMapper mapper)
    {
        _repositoryWrapper = repositoryWrapper;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TaskEntityDto>>> Handle(GetTasksByTagQuery request, CancellationToken cancellationToken)
    {
        var tasks = await _repositoryWrapper.TaskRepository.GetAllAsync(
            predicate: t => t.TaskTags.Any(tt => tt.TagId == request.TagId && tt.UserId == request.UserId),
            include: query => query
                .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag)
        );
        var dtos = _mapper.Map<IEnumerable<TaskEntityDto>>(tasks);
        return Result.Ok(dtos);
    }
}