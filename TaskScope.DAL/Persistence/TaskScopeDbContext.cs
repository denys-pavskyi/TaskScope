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


        modelBuilder.Entity<TaskEntityTag>()
            .HasKey(tt => new { tt.TaskId, tt.TagId });

        modelBuilder.Entity<TaskEntityTag>()
            .HasOne(tt => tt.Task)
            .WithMany(t => t.TaskTags)
            .HasForeignKey(tt => tt.TaskId);

        modelBuilder.Entity<TaskEntityTag>()
            .HasOne(tt => tt.Tag)
            .WithMany(t => t.TaskTags)
            .HasForeignKey(tt => tt.TagId);

        modelBuilder.Entity<TaskEntity>()
            .HasMany(t => t.TaskTags)
            .WithOne(t => t.Task)
            .HasForeignKey(tt => tt.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Tag>()
            .HasMany(t => t.TaskTags)
            .WithOne(tt => tt.Tag)
            .HasForeignKey(tt => tt.TagId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}