using coreApi.Models;
using coreLogic.Models;
using coreLogic.Models.Generic;
using Microsoft.AspNetCore.Http;

namespace coreLogic.Interfaces;

public interface IAuthManager
{
	Returns<User> GetCurrentUser();

	Returns<AuthUser> Authenticate(AuthRequest authRequest);

	Returns<AuthUser> Signup(UserToCreate userToCreate);

	Returns<AuthUser> RefreshAuth(AuthRefreshRequest request);

	void RevokeRefreshToken();
}