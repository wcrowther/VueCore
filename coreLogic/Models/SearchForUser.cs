using coreApi.Models.Generic;

namespace coreApi.Models;

public class SearchForAccount : Search
{
	public string[] StateProvinceFilter { get; set; } = [];

	public string PostalCodeFilter { get; set; } = "";

	public readonly static new SearchForAccount Default = new();
}
