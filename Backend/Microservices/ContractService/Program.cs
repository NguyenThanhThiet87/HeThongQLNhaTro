using ContractService.Data;
using Microsoft.EntityFrameworkCore;
using MassTransit;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add Database Context (PostgreSQL)
builder.Services.AddDbContext<ContractDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddGrpc();
builder.Services.AddGrpcClient<Shared.Integration.Protos.RoomService.RoomServiceClient>(o =>
{
    o.Address = new Uri(builder.Configuration["Services:PropertyGrpcUrl"] ?? "http://localhost:5002");
});
builder.Services.AddGrpcClient<Shared.Integration.Protos.UserService.UserServiceClient>(o =>
{
    o.Address = new Uri(builder.Configuration["Services:IdentityGrpcUrl"] ?? "http://localhost:5001");
});

// Consume integration events from the shared RabbitMQ transport.
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<ContractService.Consumers.UserEventConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMq:Host"] ?? "localhost", builder.Configuration["RabbitMq:VirtualHost"] ?? "/", h => {
            h.Username(builder.Configuration["RabbitMq:Username"] ?? "guest");
            h.Password(builder.Configuration["RabbitMq:Password"] ?? "guest");
        });
        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => Results.Ok(new { status = "healthy", service = "ContractService" }));
app.MapControllers();
app.MapGrpcService<ContractService.Services.GrpcContractService>();

app.Run();
