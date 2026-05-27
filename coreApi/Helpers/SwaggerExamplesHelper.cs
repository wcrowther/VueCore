using coreLogic.Models;
using coreData.Models;
using coreLibrary.Models;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class SwaggerExamplesHelper : ISchemaFilter
{
	public void Apply(OpenApiSchema schema, SchemaFilterContext context)
	{
		schema.Example = context.Type switch
		{
			// ==========================================================
			// Add more cases like these for other types as needed
			// ==========================================================

			// For /v1/authenticate/login
			Type t when t == typeof(AuthRequest) => new OpenApiObject
			{
				["userName"] = new OpenApiString("testten"),
				["password"] = new OpenApiString("GhostBirdhasflown!"),
			},

			// For /v1/accounts/getPagedAccounts
			Type t when t == typeof(Pager<SearchForAccount>) => new OpenApiObject
			{
				["currentRecord"]	= new OpenApiInteger(0),
				["pageSize"]		= new OpenApiInteger(10),
				["groupSize"]		= new OpenApiInteger(5),
				["search"]			= new OpenApiObject
				{
					["filter"]				= new OpenApiString(""),
					["filterType"]			= new OpenApiString(""),
					["stateProvinceFilter"] = new OpenApiString(""),
					["postalCodeFilter"]	= new OpenApiString(""),
				}
			},

			_ => schema.Example // ---> leave unchanged if no match
		};
	}
}

