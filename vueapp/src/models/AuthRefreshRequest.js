

export default class AuthRefreshRequest 
{
    constructor(userId) 
    {
		  this.UserId			= userId || 0
		  // RefreshToken is stored in an http only cookie on the server so not needed here
    }
}