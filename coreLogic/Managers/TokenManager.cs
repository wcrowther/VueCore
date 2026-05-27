using coreData.Models;
using coreLogic.Models;
using coreLogic.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace coreLogic.Managers;

public class TokenManager(AppSettings appSettings)
: ITokenManager
{
	public (string token, DateTime expiration) GenerateJwtToken(User user)
	{
		var baseClaims = new List<Claim>()
			{
				new (ClaimTypes.NameIdentifier,              user.UserId.ToString()),
				new (ClaimTypes.Name,                        user.UserName),
				new (JwtRegisteredClaimNames.Sub,        user.UserId.ToString()),
				new (JwtRegisteredClaimNames.Jti,        Guid.NewGuid().ToString()),
				new (JwtRegisteredClaimNames.UniqueName, user.UserName),
		};

		var options = StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries;
		var roleClaims = user.Role.Split(',', options).Select(s => new Claim(ClaimTypes.Role, s));

		baseClaims.AddRange(roleClaims);

		var key			= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.AuthSigningKey));
		var creds		= new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
		var expiration	= DateTime.Now.AddMinutes(appSettings.TokenExpirationMinutes);
		var jwtToken	= new JwtSecurityToken
		(
			claims: baseClaims,
			issuer: appSettings.AuthIssuer,
			audience: appSettings.AuthAudience,
			expires: expiration,
			signingCredentials: creds
		);

		var token = new JwtSecurityTokenHandler().WriteToken(jwtToken);

		return (token, expiration);
	}

	public (string token, DateTime expiration) GenerateRefreshTokenAndExpiration()
	{
		var randomNumber = new byte[32];
		using var rng = RandomNumberGenerator.Create();
		rng.GetBytes(randomNumber);

		var expiration = DateTime.Now.AddDays(appSettings.RefreshTokenExpirationDays);

		return (Convert.ToBase64String(randomNumber), expiration);
	}

	public User CreateNewRefreshTokenForUser(User user)
	{
		var (token, expiration) = GenerateRefreshTokenAndExpiration();

		user.RefreshToken           = token;
		user.RefreshTokenIssuedAt   = DateTime.Now;
		user.RefreshTokenExpiration = expiration;
		user.RefreshTokenRevokedAt  = null;

		return user;
	}
}
