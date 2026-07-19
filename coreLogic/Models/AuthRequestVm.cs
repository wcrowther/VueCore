using System.ComponentModel.DataAnnotations;

namespace coreLogic.Models;

public class AuthRequestVm
{
	[Required]
	public string UserName { get; set; }

	[Required]
	public string Password { get; set; }

	public override string ToString() => $"{UserName} : UserName";
}
