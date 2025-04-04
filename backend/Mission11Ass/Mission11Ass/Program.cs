using System.Net;
using Microsoft.EntityFrameworkCore;
using Mission11Ass.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BookstoreDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactAppBook",
        policy => {
            policy.WithOrigins("http://localhost:3000", "https://victorious-sky-0c0d8921e.6.azurestaticapps.net")
                .AllowAnyMethod()
                .AllowAnyHeader();
    }));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactAppBook");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();