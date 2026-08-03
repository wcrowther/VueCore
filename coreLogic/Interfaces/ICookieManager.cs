using Microsoft.AspNetCore.Http;

namespace coreLogic.Interfaces;

public interface ICookieManager
{
	void SetAccessTokenCookie(string token, DateTime expiresAt);
	void SetRefreshTokenCookie(string refreshToken);
	void ClearAuthCookies();
}