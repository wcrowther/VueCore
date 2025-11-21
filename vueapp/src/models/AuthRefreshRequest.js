

export default class AuthRefreshRequest 
{
    constructor(userId) 
    {
		this.UserId			= userId || ''
		// RefreshToken is stored in an http only cookie on the server so not needed here
    }
}