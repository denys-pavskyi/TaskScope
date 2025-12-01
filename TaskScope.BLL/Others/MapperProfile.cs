using AutoMapper;
using TaskScope.BLL.Models.Dtos.Tags;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Entities;

namespace TaskScope.BLL.Others;

public class MapperProfile : Profile
{

    public MapperProfile()
    {
        // Task mappings
        CreateMap<TaskEntity, TaskEntityDto>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src =>
                src.TaskTags.Select(tt => tt.Tag)));

        CreateMap<CreateTaskDto, TaskEntity>();
        CreateMap<UpdateTaskDto, TaskEntity>();

        // Tag mappings
        CreateMap<Tag, TagDto>();
        CreateMap<CreateTagDto, Tag>();
        CreateMap<UpdateTagDto, Tag>();
    }

}