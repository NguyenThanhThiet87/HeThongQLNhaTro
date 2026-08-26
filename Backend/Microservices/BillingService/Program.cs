using BillingService.Data;
using Microsoft.EntityFrameworkCore;
using MassTransit;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BillingDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSignalR();
builder.Services.AddSingleton<Microsoft.AspNetCore.SignalR.IUserIdProvider, BillingService.Hubs.CustomUserIdProvider>();
builder.Services.AddGrpcClient<Shared.Integration.Protos.UserService.UserServiceClient>(o =>
{
    o.Address = new Uri(builder.Configuration["Services:IdentityGrpcUrl"] ?? "http://localhost:5001");
});
builder.Services.AddGrpcClient<Shared.Integration.Protos.UtilityIndexService.UtilityIndexServiceClient>(o =>
{
    o.Address = new Uri(builder.Configuration["Services:UtilityGrpcUrl"] ?? "http://localhost:5004");
});
builder.Services.AddGrpcClient<Shared.Integration.Protos.ContractQueryService.ContractQueryServiceClient>(o =>
{
    o.Address = new Uri(builder.Configuration["Services:ContractGrpcUrl"] ?? "http://localhost:5003");
});

// Consume integration events from the shared RabbitMQ transport.
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<BillingService.Consumers.UserEventConsumer>();

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

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();
app.MapHub<BillingService.Hubs.ChatHub>("/chathub");
app.Run();
