using coreApi.Helpers;
using coreData.Models;
using coreLibrary.Models;
using coreLogic.Interfaces;
using coreLogic.Models;
using Microsoft.AspNetCore.Mvc;

namespace coreApi;

public static partial class Endpoints
{
    public static void AccountEndpoints(this WebApplication app)
    {
        var endpoints = app.MapGroup("/v1/accounts")
							.RequireAuthorization()
							.WithOpenApi()
							.WithTags("Accounts");

		endpoints.MapGet("/getAllAccounts", (IAccountManager _accountManager) =>
        {
            var accounts = _accountManager.GetAllAccounts();

            return Results.Ok(accounts);
        })
		.WithSummary("Retrieves a list of all Accounts")
		.WithDescription("This endpoint returns a comprehensive list of all Accounts."); 

        endpoints.MapPost("/getPagedAccounts", ( IAccountManager _accountManager, 
												 [FromBody] Pager<SearchForAccount> pager) =>
        {
            var accounts = _accountManager.GetPagedAccounts(pager);

            return Results.Ok(accounts);
        });

        endpoints.MapGet("/getAccountById/{accountId}", (IAccountManager _accountManager, 
														 int accountId) =>
        {
            var acct = _accountManager.GetAccountById(accountId);

            return Results.Ok(acct);
        });

		endpoints.MapPost("/saveAccount", (	IAccountManager _accountManager,
										IAuthManager _authManager,
										[FromBody] AccountVm account) =>
		{
			var acct = _accountManager.SaveAccount(account);

			return Results.Ok(acct);
		})
		.Validate<AccountVm>(false);
	}
}


