using CommunicationService.Data;
using Microsoft.EntityFrameworkCore;
using MassTransit;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CommunicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// MassTransit Configuration (RabbitMQ for Commands/Jobs)
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<CommunicationService.Consumers.NotificationCommandConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMq:Host"] ?? "localhost", builder.Configuration["RabbitMq:VirtualHost"] ?? "/", h => {
            h.Username(builder.Configuration["RabbitMq:Username"] ?? "guest");
            h.Password(builder.Configuration["RabbitMq:Password"] ?? "guest");
        });

        cfg.ReceiveEndpoint("notification-queue", e =>
        {
            e.ConfigureConsumer<CommunicationService.Consumers.NotificationCommandConsumer>(context);
        });
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
