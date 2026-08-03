using coreData.Models;

namespace coreLogic.Interfaces;

public interface ITokenManager
{
	User CreateNewRefreshTokenForUser(User user);

	(string token, DateTime expiration) GenerateJwtToken(User user);

	(string token, DateTime expiration) GenerateRefreshTokenAndExpiration();
}
