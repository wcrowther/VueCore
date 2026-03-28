namespace coreApi.Models;

public class FolderNode
{
	public string Name { get; set; } = "";

	public int FileCount { get; set; }

	public List<FolderNode> Children { get; set; } = new();
}