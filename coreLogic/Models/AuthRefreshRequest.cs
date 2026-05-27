namespace coreLogic.Models;

public class AuthRefreshRequest
{
	public int UserId { get; set; }

	// Refresh token is stored in an http only cookie
}
