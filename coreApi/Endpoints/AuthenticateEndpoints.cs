using coreApi.Helpers;
using coreApi.Models;
using coreLogic.Interfaces;
using coreLogic.Models;
using coreLogic.Models.Generic;
using System.Runtime.CompilerServices;
using System.Security.Claims;
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
		// me (get current user claims for JWT testing)
		// =========================================================

		endpoints.MapGet("/me", 
		(	ClaimsPrincipal user) =>
		{
			return user.Claims.Select(c => new { c.Type, c.Value });

		});

		// =========================================================
		// login
		// =========================================================

		endpoints.MapPost("/login", 
		(	AuthRequest model, 
			IAuthManager _authManager
		) =>
		{
            Returns<AuthUser> returns = _authManager.Authenticate(model);

			return	returns.Ok
					? Results.Ok(returns.Data)
					: Results.Unauthorized();
		})
		.Validate<AuthRequest>(false)
		.Produces<AuthUser>(StatusCodes.Status200OK) 
		.Produces(StatusCodes.Status401Unauthorized) 
		.WithName("Login");

		// =========================================================
		// signup 
		// =========================================================

		endpoints.MapPost("/signup", 
		(	
			UserToCreate model, 
			IAuthManager _authManager									 
		) =>
		{
			Returns<AuthUser> returns = _authManager.Signup(model);

			return	returns.Ok 
					? Results.Ok(returns.Data) 
					: Results.BadRequest(returns.Error.Message);
		})
		.Validate<UserToCreate>(false)
		.WithName("Signup");

		// =========================================================
		// refreshAuth
		// =========================================================

		endpoints.MapPost("/refreshAuth", 
		(	
			AuthRefreshRequest request, 
			IAuthManager _authManager
		) =>
		{
			Returns<AuthUser> returns = _authManager.RefreshAuth(request);

			return	returns.Ok 
					? Results.Ok(returns.Data) 
					: Results.BadRequest(returns.Error.Message);
		})
		.Validate<AuthRefreshRequest>(false)
		.WithName("RefreshAuth");
	}
}

