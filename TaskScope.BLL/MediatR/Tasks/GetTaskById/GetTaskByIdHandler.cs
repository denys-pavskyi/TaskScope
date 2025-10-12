using AutoMapper;
using FluentResults;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tasks.GetTaskById;

public class GetTaskByIdHandler : IRequestHandler<GetTaskByIdQuery, Result<TaskEntityDto>>
{
    private readonly IRepositoryWrapper _repositoryWrapper;
    private readonly IMapper _mapper;

    public GetTaskByIdHandler(IRepositoryWrapper repositoryWrapper, IMapper mapper)
    {
        _repositoryWrapper = repositoryWrapper;
        _mapper = mapper;
    }

    public async Task<Result<TaskEntityDto>> Handle(GetTaskByIdQuery request, CancellationToken cancellationToken)
    {
        var task = await _repositoryWrapper.TaskRepository.GetFirstOrDefaultAsync(
            predicate: t => t.Id == request.TaskId,
            include: query => query
                .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag)
        );
        if (task is null)
        {
            return Result.Fail("Task not found");
        }
        
        var dto = _mapper.Map<TaskEntityDto>(task);
        return Result.Ok(dto);
    }
}