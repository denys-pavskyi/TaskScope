using System.Net;
using System.Text.Json;
using FluentValidation;

namespace TaskScope.API.Middlewares;

public class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlerMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred. TraceId={TraceId}", context.TraceIdentifier);
            await HandleExceptionAsync(context, ex);
        }
    }
    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        if (context.Response.HasStarted)
        {
            _logger.LogWarning(
                "The response has already started, cannot write error. TraceId={TraceId}",
                context.TraceIdentifier);
            return Task.CompletedTask;
        }

        var statusCode = exception switch
        {
            BadHttpRequestException bhr => (HttpStatusCode)bhr.StatusCode,
            ArgumentException => HttpStatusCode.BadRequest,
            FormatException => HttpStatusCode.BadRequest,
            ValidationException => HttpStatusCode.BadRequest,
            UnauthorizedAccessException => HttpStatusCode.Unauthorized,
            KeyNotFoundException => HttpStatusCode.NotFound,
            NotImplementedException => HttpStatusCode.NotImplemented,
            OperationCanceledException => (HttpStatusCode)408,
            _ => HttpStatusCode.InternalServerError
        };

        object response;
        
        if (exception is ValidationException validationException)
        {
            var errors = validationException.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray());
            
            response = new
            {
                error = "One or more validation errors occurred.",
                statusCode = (int)statusCode,
                traceId = context.TraceIdentifier,
                errors = errors
            };
        }
        else
        {
            var message = _env.IsEnvironment("Local") || _env.IsDevelopment() ? exception.Message : "An unexpected error occurred.";
            response = new
            {
                error = message,
                statusCode = (int)statusCode,
                traceId = context.TraceIdentifier
            };
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;
        context.Response.Headers.CacheControl = "no-store";

        var json = JsonSerializer.Serialize(response);
        return context.Response.WriteAsync(json);
    }
}