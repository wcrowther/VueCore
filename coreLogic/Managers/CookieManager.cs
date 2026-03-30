using coreApi.Models;
using coreLogic.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace coreLogic.Managers;

public class CookieManager(	AppSettings appSettings,
							IHttpContextAccessor accessor) 
: ICookieManager
{
	public void SetAccessTokenCookie(string token, DateTime expiresAt)
	{
		accessor.HttpContext.Response.Cookies.Append("accessToken", token, new CookieOptions
		{
			HttpOnly	= true,
			Secure		= true,
			SameSite	= SameSiteMode.None,
			Expires		= expiresAt
		});
	}

	public void SetRefreshTokenCookie(string refreshToken)
	{
		accessor.HttpContext.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
		{
			HttpOnly	= true,						// Prevent access from JavaScript
			Secure		= true,						// Require HTTPS
			SameSite	= SameSiteMode.None,		// Prevent CSRF attacks
			Expires		= DateTime.Now.AddDays(appSettings.RefreshTokenExpirationDays)
		});
	}

	public void ClearAuthCookies()
	{
		accessor.HttpContext.Response.Cookies.Delete("accessToken", new CookieOptions
		{
			HttpOnly	= true,
			Secure		= true,
			SameSite	= SameSiteMode.None
		});

		accessor.HttpContext.Response.Cookies.Delete("refreshToken", new CookieOptions
		{
			HttpOnly	= true,
			Secure		= true,
			SameSite	= SameSiteMode.None
		});
	}
}
