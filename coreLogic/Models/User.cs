
using coreLogic.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace coreApi.Models;

public class User : IAuditable
{
	public int UserId { get; set; }

	[Required, Length(5,50, ErrorMessage = $"The {nameof(UserName)} property must be 5 or more characters and 50 or less.")]
	public string UserName { get; set; }

	[Required, MaxLength(50)]
	public string FirstName { get; set; } 

	[Required, MaxLength(50)]
	public string LastName { get; set; } 

	[Required, MaxLength(50)]
	[EmailAddress(ErrorMessage = $"The {nameof(UserEmail)} property must be an Email Address.")]
    public string UserEmail { get; set; } 

    [JsonIgnore]
    public string PasswordHash { get; set; }

	[AllowedValues("User", "Admin", "SuperAdmin")]
	public string Role { get; set; }

	public string RefreshToken { get; set; }

	public DateTime RefreshTokenIssuedAt { get; set; }

	public DateTime RefreshTokenExpiration { get; set; }

	public DateTime? RefreshTokenRevokedAt { get; set; }

	public bool IsActive { get; set; }

	public DateTime DateCreated { get; set; }

	public DateTime DateModified { get; set; }

	public int CreatorId { get; set; }

	public int ModifierId { get; set; }

	[NotMapped]
	public string CreatorName { get; set; }

	[NotMapped]
	public string ModifierName { get; set; }

	public override string ToString() => $"{FirstName} {LastName} Id: {UserId}";
}
