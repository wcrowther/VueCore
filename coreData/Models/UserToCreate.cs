using System.ComponentModel.DataAnnotations;

namespace coreData.Models;

public class UserToCreate : User
{
	public required string Password { get; init; }
}
