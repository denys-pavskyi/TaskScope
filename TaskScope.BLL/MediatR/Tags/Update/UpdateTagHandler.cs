using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.MediatR.Tags.Update;
using TaskScope.BLL.Models.Dtos.Tags;
using TaskScope.DAL.Entities;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TagScope.BLL.MediatR.Tags.Update;


public class UpdateTagHandler : IRequestHandler<UpdateTagCommand, Result<TagDto>>
{
    private readonly IMapper _mapper;
    private readonly IRepositoryWrapper _repositoryWrapper;
    public UpdateTagHandler(IMapper mapper, IRepositoryWrapper repositoryWrapper)
    {
        _mapper = mapper;
        _repositoryWrapper = repositoryWrapper;
    }

    public async Task<Result<TagDto>> Handle(UpdateTagCommand request, CancellationToken cancellationToken)
    {
        var tagEntity = _mapper.Map<Tag>(request.NewTag);

        _repositoryWrapper.TagRepository.Update(tagEntity);
        var resultIsSuccess = await _repositoryWrapper.SaveChangesAsync() > 0;
        if (resultIsSuccess)
        {
            return Result.Ok(_mapper.Map<TagDto>(tagEntity));
        }

        return Result.Fail("Failed to create tag");
    }
}