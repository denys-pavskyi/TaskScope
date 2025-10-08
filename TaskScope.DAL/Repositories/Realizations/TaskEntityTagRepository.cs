using TaskScope.DAL.Entities;
using TaskScope.DAL.Persistence;
using TaskScope.DAL.Repositories.Interfaces;
using TaskScope.DAL.Repositories.Realizations.Base;

namespace TaskScope.DAL.Repositories.Realizations;

public class TaskEntityTagRepository : RepositoryBase<TaskEntityTag>, ITaskEntityTagRepository
{
    public TaskEntityTagRepository(TaskScopeDbContext dbContext)
        : base(dbContext)
    {
    }
}