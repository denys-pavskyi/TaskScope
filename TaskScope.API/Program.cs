
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TaskScope.API.Models;
using TaskScope.BLL.Others;
using TaskScope.DAL.Persistence;
using TaskScope.DAL.Repositories.Interfaces.Base;
using TaskScope.DAL.Repositories.Realizations.Base;

namespace TaskScope.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<TaskScopeDbContext>(options =>
                options.UseSqlServer(builder.Configuration["ConnectionStrings:MsSqlServer"]));

            builder.Services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<MapperProfile>();
            }, AppDomain.CurrentDomain.GetAssemblies());

            var currentAssemblies = AppDomain.CurrentDomain.GetAssemblies();
            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(currentAssemblies));

            // Repository
            builder.Services.AddScoped<IRepositoryWrapper, RepositoryWrapper>();

            var corsConfig = builder.Configuration.GetSection("CORS").Get<CorsConfiguration>();
            builder.Services.AddCors(opt =>
            {
                opt.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins(corsConfig.AllowedOrigins)
                        .WithHeaders(corsConfig.AllowedHeaders)
                        .WithMethods(corsConfig.AllowedMethods);
                });
            });

            builder.Services.AddSwaggerGen();
            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.EnvironmentName == "Local")
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();



            app.MapControllers();

            app.Run();
        }
    }
}
