using System.ComponentModel.DataAnnotations;

namespace coreLogic.Models;

public class UserVm
{
	public int UserId { get; set; }

	[Required, Length(5, 50, ErrorMessage = $"The {nameof(UserName)} property must be 5 or more characters and 50 or less.")]
	public string UserName { get; set; } = "";

	[Required, MaxLength(50)]
	public string FirstName { get; set; } = "";

	[Required, MaxLength(50)]
	public string LastName { get; set; } = "";

	[Required, MaxLength(50)]
	[EmailAddress(ErrorMessage = $"The {nameof(UserEmail)} property must be an Email Address.")]
	public string UserEmail { get; set; } = "";

	[AllowedValues("User", "Admin", "SuperAdmin")]
	public string? Role { get; set; }

	public bool IsActive { get; set; }

	public DateTime DateCreated { get; set; }

	public DateTime DateModified { get; set; }

	public int CreatorId { get; set; }

	public int ModifierId { get; set; }

	public string? CreatorName { get; set; }

	public string? ModifierName { get; set; }

	public override string ToString() => $"{FirstName} {LastName} Id: {UserId}";
}
