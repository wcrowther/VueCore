using System.ComponentModel.DataAnnotations;

namespace coreLibrary.Models;

public class Search
{
	public string Filter { get; set; } = "";

	public string FilterType { get; set; } = "";

	public string Sort { get; set; } = "";

	public bool SortDesc { get; set; }

	public static readonly Search Default = new();
}
