using coreApi;
using coreApi.Data;
using coreApi.Helpers;
using coreApi.Models;
using coreLogic.Helpers;
using coreLogic.Managers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using WildHare.Extensions;
using JsonOptions = Microsoft.AspNetCore.Http.Json.JsonOptions;

// ----------------------------------------------------------------------------------------
// Configure Application
// ----------------------------------------------------------------------------------------

var builder = WebApplication.CreateBuilder(args);

var environment = builder.Environment;

builder.Services.Configure<JsonOptions>(options => { options.SerializerOptions.PropertyNamingPolicy = null; });
builder.Services.AddSingleton(builder.Configuration.GetSection("App").Get<AppSettings>());
builder.Services.AddSingleton(new FolderManager(builder.Configuration["App:FoldersRoot"]));
builder.Services.AddSingleton(new FileManager(builder.Configuration["App:FoldersRoot"], builder.Environment));

builder.Services.AddSignalR().AddJsonProtocol(options =>
{
	options.PayloadSerializerOptions.PropertyNamingPolicy = null; // use PascalCase
}); 

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowSpecificOrigin",
		policy => policy.WithOrigins(builder.Configuration["App:AllowedOrigins"].Split(";", true))
						.AllowCredentials()
						.AllowAnyHeader()
						.AllowAnyMethod());
});

builder.Services.AddHttpContextAccessor();

Log.Logger = new LoggerConfiguration()
	.ReadFrom.Configuration(builder.Configuration)
	.CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddDbContext<CoreApiDataContext>(options =>
	options.UseSqlite(builder.Configuration.GetConnectionString("CoreApiData"))
);

builder.Services.AddAuthentication(cfg =>
{
    cfg.DefaultAuthenticateScheme   = JwtBearerDefaults.AuthenticationScheme;
    cfg.DefaultChallengeScheme      = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(c =>
{
    c.TokenValidationParameters = new TokenValidationParameters()
    {
		ValidateLifetime	= true,						// Ensures the token is not expired
		ClockSkew			= TimeSpan.Zero,			// Optional: Remove default 5-minute tolerance for expiration
		ValidIssuer         = builder.Configuration["App:AuthIssuer"],
		ValidAudience       = builder.Configuration["App:AuthAudience"],
        IssuerSigningKey    = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["App:AuthSigningKey"])),
		RoleClaimType		= "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
	};
	c.Events = new JwtBearerEvents
	{
		OnMessageReceived = context =>
		{
			if (string.IsNullOrEmpty(context.Token) &&
				context.Request.Cookies.TryGetValue("accessToken", out var cookieToken))
			{
				context.Token = cookieToken;
			}

			return Task.CompletedTask;
		}
	};
	c.IncludeErrorDetails   = environment.IsDevelopment();
});

builder.Services.AddAuthorizationBuilder()
	.AddPolicy("User",		 policy => policy.RequireRole("User", "Admin", "SuperAdmin"))
	.AddPolicy("Admin",		 policy => policy.RequireRole("Admin", "SuperAdmin"))
	.AddPolicy("SuperAdmin", policy => policy.RequireRole("SuperAdmin"));

builder.Services.AddEndpointsApiExplorer();  // OpenApi

builder.Services.AddMyCustomSwaggerGen();

builder.Services.AddAntiforgery(options => { options.HeaderName = "X-XSRF-TOKEN"; });

builder.Services.AddMyServices();  // Dependency Injection of My Services

// ----------------------------------------------------------------------------------------
// Build Application
// ----------------------------------------------------------------------------------------

var app = builder.Build();

app.UseStaticFiles();

app.MapFallbackToFile("/index.html");

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();

app.UseAuthorization();

app.UseMiddleware<DebugMiddleware>(); // Only runs in Development

app.UseAntiforgery();

app.UseMyEndpoints();

app.UseMyRealtimeHubs();

app.UseMyCustomSwagger();

// ========================================================================================================

app.Run();


