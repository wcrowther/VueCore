
namespace coreLogic.Models;

public class FileItem
{
	public string Name { get; set; } = "";

	public string Extension { get; set; } = "";

	public long Size { get; set; }

	public DateTime LastModified { get; set; }
}
