
export default class UserModel 
{
    constructor() 
    {
		this.UserId			= 0
		this.UserName		= ''
		this.FirstName		= ''
		this.LastName		= ''
		this.UserEmail		= ''
		this.Role			= 'User'
		this.IsActive       = false 
    	this.CreatedDate    = null 
    	this.ModifiedDate   = null 
    	this.CreatedId      = 0
    	this.ModifiedId     = 0
		this.CreatorName    = ''
    	this.ModifierName   = ''
    }
}