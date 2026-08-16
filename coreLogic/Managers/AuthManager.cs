using coreData.Interfaces;
using coreData.Models;
using coreLibrary.Models;
using coreLogic.Adapters;
using coreLogic.Interfaces;
using coreLogic.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using WildHare.Extensions;
using static System.Environment;

namespace coreLogic.Managers;

public class AuthManager(
    IUserManager userManager,
    IUserRepo userRepo,
    ITokenManager tokenManager,
    ICookieManager cookieManager,
    IUserClaimsManager userClaimsManager,
    ILogger<AuthManager> logger,
    IHttpContextAccessor accessor,
    AppSettingsVm appSettings)
    : IAuthManager
{
    public Returns<UserVm> GetCurrentUser()
    {
        string userName = userClaimsManager.GetCurrentUsername();
        var user = userName.IsNullOrEmpty() ? null : userManager.GetUserByUsername(userName);

        return Returns<UserVm>.Result(user, "Not able to get the current user.");
    }

    public Returns<AuthUser> Authenticate(AuthRequestVm authRequest)
    {
        if (authRequest is null)
            return Returns<AuthUser>.Failure("AuthRequest cannot be null.");

        // Need raw User for PasswordHash verification
        var user = userRepo.GetUserByUserName(authRequest.UserName);

        if (user == null || !BCrypt.Net.BCrypt.Verify(authRequest.Password, user.PasswordHash))
        {
            string attemptHash = BCrypt.Net.BCrypt.HashPassword(authRequest.Password);
            string message     = $"Not able to authenticate user {authRequest.UserName}. ";
            string techMessage = user is null
                                 ? "UserName not found in database."
                                 : $"Password incorrect. AttemptHash: {attemptHash}.";

            logger.LogInformation(message + NewLine + techMessage);
            return Returns<AuthUser>.Failure(message);
        }

        logger.LogInformation($"AuthManager.Authenticate user '{authRequest.UserName}'");

        tokenManager.CreateNewRefreshTokenForUser(user);
        var savedUser = userRepo.SaveUser(user);

        if (savedUser is null)
            return Returns<AuthUser>.Failure($"Not able to save user {authRequest.UserName}.");

        cookieManager.SetRefreshTokenCookie(savedUser?.RefreshToken ?? "");

        return Returns<AuthUser>.Result(GetAuthResponse(savedUser));
    }

    public Returns<AuthUser> Signup(UserToCreate userToCreate)
    {
        if (userToCreate is null)
            return Returns<AuthUser>.Failure("UserToCreate cannot be null.");

        var existingUser = userRepo.GetUserByUserName(userToCreate.UserName ?? "");
        if (existingUser is not null)
            return new Error($"Not able to sign up user {userToCreate}");

        var createdUser  = userManager.CreateUser(userToCreate);
        if (createdUser is null)
            return Returns<AuthUser>.Failure($"Not able to create user {userToCreate.UserName}.");
        var rawUser      = userRepo.GetUserByUserName(createdUser.UserName);
        var authResponse = GetAuthResponse(rawUser);

        return Returns<AuthUser>.Result(authResponse);
    }

    public Returns<AuthUser> RefreshAuth(AuthRefreshRequest request)
    {
        if (request is null)
            return Returns<AuthUser>.Failure("AuthRefreshRequest cannot be null.");

        var user           = userRepo.GetUserById(request.UserId);
        var refreshToken   = accessor.HttpContext?.Request?.Cookies["refreshToken"];
        var domain         = accessor.HttpContext?.Request?.Headers.Origin.ToString();
        var allowedDomains = appSettings.AllowedOrigins.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        if (!IsAllowedDomain(domain, allowedDomains))
            return AuthUserOrError.Failure("Not able to refresh token from this domain");

        var isRevoked = user?.RefreshTokenRevokedAt is not null
                        && user.RefreshTokenIssuedAt <= user.RefreshTokenRevokedAt.Value;

        if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiration <= DateTime.Now || isRevoked)            return Returns<AuthUser>.Failure($"Not able to refresh token for userId: {request.UserId}");

        tokenManager.CreateNewRefreshTokenForUser(user);
        var savedUser = userRepo.SaveUser(user);
        if (savedUser is null)
            return Returns<AuthUser>.Failure($"Not able to save user for userId: {request.UserId}.");
        cookieManager.SetRefreshTokenCookie(savedUser.RefreshToken);

        var (token, expiration) = tokenManager.GenerateJwtToken(savedUser);
        cookieManager.SetAccessTokenCookie(token, expiration);

        logger.LogInformation($"AuthManager.RefreshAuth refresh user: '{savedUser.UserName}'");

        return Returns<AuthUser>.Result(savedUser.ToAuthResponse(token, expiration));
    }

    public void RevokeRefreshToken()
    {
        var refreshToken = accessor.HttpContext?.Request?.Cookies["refreshToken"];
        if (refreshToken.IsNullOrSpace())
            return;

        var currentUserId = userClaimsManager.GetCurrentUserId();
        var user = currentUserId.HasValue
            ? userRepo.GetUserById(currentUserId.Value)
            : userRepo.GetAllUsers().FirstOrDefault(u => u.RefreshToken == refreshToken);

        if (user is null || user.RefreshToken != refreshToken)
            return;

        user.RefreshTokenRevokedAt  = DateTime.Now;
        user.RefreshTokenExpiration = DateTime.Now;
        user.RefreshToken           = string.Empty;

        userRepo.SaveUser(user);

        logger.LogInformation($"AuthManager.RevokeRefreshToken revoked refresh token for user '{user.UserName}'");
    }

    // ============================================================================

    private AuthUser GetAuthResponse(User user)
    {
        if (user is null)
            return null;

        var (token, tokenExpiration) = tokenManager.GenerateJwtToken(user);
        cookieManager.SetAccessTokenCookie(token, tokenExpiration);
        cookieManager.SetUserIdCookie(user.UserId);
        return new AuthUser(user, token, tokenExpiration);
    }

    private static bool IsAllowedDomain(string domain, string[] allowedDomains)
    {
        if (allowedDomains?[0] == "*")
            return true;

        return (allowedDomains ?? []).Any(a => a.Equals(domain, StringComparison.OrdinalIgnoreCase));
    }
}

