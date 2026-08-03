using System.ComponentModel.DataAnnotations;

namespace coreData.Models;

public class Image
{
	[Required]
	public Guid ImageId { get; set; }

	[Required]
	public string ImageSrc { get; set; }
}
