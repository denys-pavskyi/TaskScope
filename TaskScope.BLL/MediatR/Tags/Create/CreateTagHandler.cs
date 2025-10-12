using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.MediatR.Tasks.Create;
using TaskScope.BLL.Models.Dtos.Tags;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Entities;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tags.Create;

public class CreateTagHandler : IRequestHandler<CreateTagCommand, Result<TagDto>>
{
    private readonly IMapper _mapper;
    private readonly IRepositoryWrapper _repositoryWrapper;


    public CreateTagHandler(IMapper mapper, IRepositoryWrapper repositoryWrapper)
    {
        _mapper = mapper;
        _repositoryWrapper = repositoryWrapper;
    }

    public async Task<Result<TagDto>> Handle(CreateTagCommand request, CancellationToken cancellationToken)
    {
        var tagEntity = _mapper.Map<Tag>(request.NewTag);
        var createdTag = await _repositoryWrapper.TagRepository.CreateAsync(tagEntity);
        var createdTagDto = _mapper.Map<TagDto>(createdTag);

        var resultIsSuccess = await _repositoryWrapper.SaveChangesAsync() > 0;
        if (resultIsSuccess)
        {
            return Result.Ok(createdTagDto);
        }

        return Result.Fail("Failed to create new tag");
    }
}