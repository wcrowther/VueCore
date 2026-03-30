
function AuthUser (userId, firstName, lastName, userName, userEmail, role, roles)
{
	this.UserId    = userId || 0
	this.FirstName = firstName || ''
	this.LastName  = lastName || ''
	this.UserName  = userName || ''
	this.UserEmail = userEmail || ''
	this.Role      = role || ''
	this.Roles     = Array.isArray(roles) ? roles : []
}

export { AuthUser }

	
