using coreLogic.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Diagnostics;
using System.Runtime.InteropServices;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace coreApi.Helpers;

public static class SwaggerHelper 
{
	public static void AddMyCustomSwaggerGen(this IServiceCollection services)
	{
		services.AddSwaggerGen(AddMySwaggerGenOptions());
	}	

	public static void UseMyCustomSwagger(this WebApplication app, bool allEnvironments = true)
	{
		if (allEnvironments || app.Environment.IsDevelopment())
		{
			app.UseSwagger(MyUseSwaggerOptions());
			app.UseSwaggerUI(MyUseSwaggerUIOptions());
		}
	}

	// ==================================================================================

	private static Action<SwaggerGenOptions> AddMySwaggerGenOptions()
	{
		return options =>
		{
			options.SwaggerDoc("v1", new OpenApiInfo
			{
				Title		= "VueCore API",
				Version		= "v1",
				Description = "Welcome to the VueCore API documentation. This OpenAPI definition is generated automatically by Swagger and is configured by environment so it can be enabled or disabled as needed. " +
							  "Since Swagger UI (Swashbuckle) is no longer included in the default .NET 9+ Web API templates, it is added to this project manually via NuGet. \n\n" +
							  "Most endpoints require authentication. In normal application usage, signing in through the Vue frontend issues a .NET authentication cookie that is sent with subsequent API requests. " +
							  "Authenticate.Login uses this cookie-based flow and does not return a token in the response body. " +
							  "For API clients such as Postman or manual bearer testing, use Authenticate.Token to retrieve a JWT, then use the Authorize button and provide: Bearer {token}. \n\n"
			});

			options.AddSecurityDefinition("Bearer",
				new OpenApiSecurityScheme()
				{
					In              = ParameterLocation.Header,
					Type            = SecuritySchemeType.ApiKey,
					Scheme          = JwtBearerDefaults.AuthenticationScheme,
					Name            = "Authorization",
					BearerFormat    = "JWT",
					Description     = "Use Authenticate.Token to retrieve a JWT and paste it as: Bearer {token}. " +
									  "Cookie-based authentication via Authenticate.Login is also supported in this Swagger session."
				}
			);

			options.AddSecurityRequirement(new OpenApiSecurityRequirement {
				{
					new OpenApiSecurityScheme
					{
						Reference = new OpenApiReference
						{
							Type = ReferenceType.SecurityScheme,
							Id = "Bearer"
						}
					},
					Array.Empty<string>()
				}
			});

			// Create custom Swagger input values for example calls
			options.SchemaFilter<SwaggerExamplesHelper>();
		};
	}

	/// <summary>Update project Swagger options</summary>
	private static Action<SwaggerOptions> MyUseSwaggerOptions()
	{
		return options =>
		{
			options.RouteTemplate = "docs/{documentName}/docs.json";
			options.SerializeAsV2 = true;  // Required for DotNet 9 to work 
		};
	}

	/// <summary>Update project Swagger UI options and routes</summary>
	private static Action<SwaggerUIOptions> MyUseSwaggerUIOptions()
	{
		return options =>
		{
			options.RoutePrefix = "docs";

			options.SwaggerEndpoint("/docs/v1/docs.json", "VueCore V1");
			options.EnableTryItOutByDefault();
			options.InjectStylesheet("/swagger-ui/custom.css");
			options.InjectJavascript("/swagger-ui/custom.js");
		};
	}
}
