using Microsoft.AspNetCore.Mvc;
using coreApi.Helpers.Extensions;
using System.Reflection;

namespace coreApi.Helpers;

public static class CustomRouteHandlerBuilder
{
	public static RouteHandlerBuilder Validate<T>(this RouteHandlerBuilder builder, bool firstErrorOnly = true, string errorDivider = " ")
	{ 
		builder.AddEndpointFilter(async (invocationContext, next) =>
		{
			var argument = invocationContext.Arguments.OfType<T>().FirstOrDefault();

			if (argument is null)
				return await next(invocationContext);

			var response = argument.DataAnnotationsValidate();

			if (!response.IsValid)
			{
				string errorMessage =	firstErrorOnly ? 
										response.Results.FirstOrDefault().ErrorMessage : 
										string.Join(errorDivider, response.Results.Select(x => x.ErrorMessage));

				return Results.Problem(errorMessage, statusCode: 400);
			}

			return await next(invocationContext);
		});

		return builder;
	}

	public static RouteHandlerBuilder ValidateDataAnnotationsFromBody(this RouteHandlerBuilder builder, bool firstErrorOnly = true)
	{
		builder.AddEndpointFilterFactory((filterFactoryContext, next) =>
		 {
			 return async invocationContext =>
			 {
				 var parameters = filterFactoryContext.MethodInfo.GetParameters();
				 var fromBodyType = parameters.FirstOrDefault(pi => pi.GetCustomAttributes<FromBodyAttribute>().Any()).ParameterType;

				 if (fromBodyType != null)
				 {
					 var argument = invocationContext.Arguments.FirstOrDefault(w => w.GetType() == fromBodyType);
					 var response = argument.DataAnnotationsValidate();

					 if (!response.IsValid)
					 {
						 string errorMessage =	firstErrorOnly ?
												response.Results.FirstOrDefault().ErrorMessage :
												string.Join("|", response.Results.Select(x => x.ErrorMessage));

						 return Results.Problem(errorMessage, statusCode: 400);
					 }
				 }
				 return await next(invocationContext);
			 };
		 });

		return builder;
	}

	// CODE NOT WORKING
	// public static RouteGroupBuilder ValidateDataAnnotationsGroups(this RouteGroupBuilder builder, bool firstErrorOnly = true)
	// {
	// 	builder.AddEndpointFilterFactory((filterFactoryContext, next) =>
	// 	{
	// 		return async invocationContext =>
	// 		{
	// 			var parameters = filterFactoryContext.MethodInfo.GetParameters();
	// 			var fromBodyType = parameters.FirstOrDefault(pi => pi.GetCustomAttributes<FromBodyAttribute>().Any()).ParameterType;
	// 
	// 			if (fromBodyType != null)
	// 			{
	// 				var argument = invocationContext.Arguments.FirstOrDefault(w => w.GetType() == fromBodyType);
	// 				var response = argument.DataAnnotationsValidate();
	// 
	// 				if (!response.IsValid)
	// 				{
	// 					string errorMessage = firstErrorOnly ?
	// 										   response.Results.FirstOrDefault().ErrorMessage :
	// 										   string.Join("|", response.Results.Select(x => x.ErrorMessage));
	// 
	// 					return Results.Problem(errorMessage, statusCode: 400);
	// 				}
	// 			}
	// 			return await next(invocationContext);
	// 		};
	// 	});
	// 
	// 	return builder;
	// }
}



// 	var extensions = verbose ? response.Results.ToDictionary(g => g.ErrorMessage, g => (object)g.MemberNames) : null;
