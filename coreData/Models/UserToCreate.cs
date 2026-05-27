using System.ComponentModel.DataAnnotations;

namespace coreData.Models;

public class UserToCreate : User
{
	[Required]
	public string Password { get; init; }
}
