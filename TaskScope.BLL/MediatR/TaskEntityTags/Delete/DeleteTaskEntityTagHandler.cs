using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.TaskEntityTags;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.TaskEntityTags.Delete;

public class DeleteTaskEntityTagHandler : IRequestHandler<DeleteTaskEntityTagCommand, Result<TaskEntityTagDto>>
{
    private readonly IMapper _mapper;
    private readonly IRepositoryWrapper _repositoryWrapper;

    public DeleteTaskEntityTagHandler(IMapper mapper, IRepositoryWrapper repositoryWrapper)
    {
        _mapper = mapper;
        _repositoryWrapper = repositoryWrapper;
    }

    public async Task<Result<TaskEntityTagDto>> Handle(DeleteTaskEntityTagCommand request, CancellationToken cancellationToken)
    {
        var taskEntityTag = await _repositoryWrapper.TaskTagRepository.GetFirstOrDefaultAsync(
            tet => tet.TaskId.Equals(request.TaskId) && tet.TagId.Equals(request.TagId));

        if (taskEntityTag is null)
        {
            return Result.Fail("Task entity tag not found");
        }

        _repositoryWrapper.TaskTagRepository.Delete(taskEntityTag);
        var resultIsSuccess = await _repositoryWrapper.SaveChangesAsync() > 0;

        if (resultIsSuccess)
        {
            var mappedTaskEntityTag = _mapper.Map<TaskEntityTagDto>(taskEntityTag);
            return Result.Ok(mappedTaskEntityTag);
        }

        return Result.Fail("Failed to delete task entity tag");
    }
}
