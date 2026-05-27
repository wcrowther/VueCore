namespace coreLogic.Models;

public class UserVm
{
	public int UserId { get; set; }
	public string UserName { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public string UserEmail { get; set; }
	public string Role { get; set; }
	public bool IsActive { get; set; }
	public DateTime DateCreated { get; set; }
	public DateTime DateModified { get; set; }
	public int CreatorId { get; set; }
	public int ModifierId { get; set; }
	public string CreatorName { get; set; }
	public string ModifierName { get; set; }

	public override string ToString() => $"{FirstName} {LastName} Id: {UserId}";
}
