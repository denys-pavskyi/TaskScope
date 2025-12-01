using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TaskScope.DAL.Entities;
using TaskScope.DAL.Enums;
using TaskScope.DAL.Persistence;
using TaskScope.DAL.Repositories.Interfaces;
using TaskScope.DAL.Repositories.Realizations.Base;

namespace TaskScope.DAL.Repositories.Realizations;

public class TaskEntityRepository : RepositoryBase<TaskEntity>, ITaskEntityRepository
{
    public TaskEntityRepository(TaskScopeDbContext dbContext)
        : base(dbContext)
    {
    }

    public async Task<IEnumerable<TaskEntity>> GetAllAsync(
        DateTime? startDate = null,
        DateTime? endDate = null)
    {

        Expression<Func<TaskEntity, bool>> predicate = t =>
            (!startDate.HasValue || t.DueDate.HasValue && t.DueDate.Value.Date >= startDate.Value.Date) &&
            (!endDate.HasValue || t.DueDate.HasValue && t.DueDate.Value.Date <= endDate.Value.Date);

        var tasks = await GetAllAsync(
            predicate: predicate,
            include: query => query
                .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag));

        return tasks.OrderBy(t => t.DueDate);
    }

    public async Task<IEnumerable<TaskEntity>> GetTodayAndOverdueAsync()
    {
        var today = DateTime.UtcNow.Date;
        var tasks = await GetAllAsync(
            predicate: t => t.DueDate.HasValue &&
                            t.DueDate.Value.Date <= today,
            include: query => query
                .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag));
        return tasks.OrderBy(t => t.DueDate);
    }
}