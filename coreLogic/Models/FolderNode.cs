
using System.Security.Cryptography.X509Certificates;
using System.Text.Json.Serialization;

namespace coreApi.Models;

public class FolderNode
{
	public string Name { get; set; } = "";

	public List<FolderNode> Children { get; set; } = new();
}