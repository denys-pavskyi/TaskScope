using Microsoft.EntityFrameworkCore;
using System;
using TaskScope.DAL.Entities;

namespace TaskScope.DAL.Persistence;

public class TaskScopeDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<TaskEntity> Tasks { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<TaskEntityTag> TaskEntityTags { get; set; }

    public TaskScopeDbContext(DbContextOptions<TaskScopeDbContext> options) : base(options)
    {
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

    }
}