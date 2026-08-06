using coreApi.Helpers;
using coreData.Models;
using coreLogic.Interfaces;
using coreLogic.Models;
using coreLibrary.Models;
using Microsoft.AspNetCore.Antiforgery;
using WildHare.Extensions;

namespace coreApi;

public static partial class Endpoints
{
    public static void AuthenticateEndpoints(this WebApplication app)
    {
        var endpoints = app.MapGroup("/v1/authenticate")
                      .WithOpenApi()
					  .WithTags("Authenticate");


		// =========================================================
		// me (get current authenticated user profile)
		// =========================================================

		endpoints.MapGet("/me", ( IAuthManager _authManager ) =>
		{
			Returns<UserVm> returns = _authManager.GetCurrentUser();

			if (!returns.Ok || returns.Data is null)
				return Results.Unauthorized();

			return Results.Ok(ToProfileResponse(returns.Data));
		})
		.RequireAuthorization();

		// =========================================================
		// antiforgery token
		// =========================================================

		endpoints.MapGet("/antiforgery/token", (IAntiforgery antiforgery, HttpContext context) =>
		{
			var tokens = antiforgery.GetAndStoreTokens(context);
			return Results.Ok(new { token = tokens.RequestToken });
		})
		.RequireAuthorization()
		.WithName("GetAntiforgeryToken");

		// =========================================================
		// logout
		// =========================================================

		endpoints.MapPost("/logout", ( ICookieManager _cookieManager,
									  IAuthManager _authManager ) =>
		{
			_authManager.RevokeRefreshToken();
			_cookieManager.ClearAuthCookies();
			return Results.Ok();
		});

		// =========================================================
		// login
		// =========================================================

		endpoints.MapPost("/login", ( AuthRequestVm model, 
									  IAuthManager _authManager ) =>
		{
            Returns<AuthUser> returns = _authManager.Authenticate(model);

			return	returns.Ok
					? Results.Ok(ToProfileResponse(returns.Data))
					: Results.Unauthorized();
		})
		.Validate<AuthRequestVm>(false)
		.Produces(StatusCodes.Status200OK) 
		.Produces(StatusCodes.Status401Unauthorized) 
		.WithName("Login");

		// =========================================================
		// signup 
		// =========================================================

		endpoints.MapPost("/signup", ( UserToCreate model, 
									   IAuthManager _authManager ) =>
		{
			Returns<AuthUser> returns = _authManager.Signup(model);

			return	returns.Ok 
					? Results.Ok(ToProfileResponse(returns.Data)) 
					: Results.BadRequest(returns.Error.Message);
		})
		.Validate<UserToCreate>(false)
		.WithName("Signup");

		// =========================================================
		// refreshAuth
		// =========================================================

		endpoints.MapPost("/refreshAuth", ( HttpContext ctx,
											IAuthManager _authManager ) =>
		{
			if (!int.TryParse(ctx.Request.Cookies["userId"], out var userId))
				return Results.Unauthorized();

			var request = new AuthRefreshRequest { UserId = userId };
			Returns<AuthUser> returns = _authManager.RefreshAuth(request);

			return	returns.Ok 
					? Results.Ok(ToProfileResponse(returns.Data)) 
					: Results.BadRequest(returns.Error.Message);
		})
		.WithName("RefreshAuth");
	}

	private static object ToProfileResponse(UserVm user) => new
	{
		user.UserId,
		user.FirstName,
		user.LastName,
		user.UserName,
		user.UserEmail,
		user.Role
	};

	private static object ToProfileResponse(AuthUser user) => new
	{
		user.UserId,
		user.FirstName,
		user.LastName,
		user.UserName,
		user.UserEmail,
		user.Role
	};
}


