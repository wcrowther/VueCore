using Newtonsoft.Json;

namespace coreLibrary.Models;

public class Pager<TSearch>
{
	private int firstRecord => ((CurrentPage - 1) * PageSize) + 1;

	/* Constructors =================================================== */

	public Pager(int currentRecord = 1, int pageSize = 15, int groupSize = 5)
	{
		CurrentRecord = currentRecord;
		PageSize = pageSize;
		GroupSize = groupSize;
	}

	public int CurrentRecord { get; set; } = 1;

	public int FirstRecordInPage => (firstRecord > 1) ? firstRecord : 1;

	public int LastRecordInPage => FirstRecordInPage + PageSize - 1;

	public int CurrentPage => (int)Math.Ceiling((double)CurrentRecord / PageSize);

	public int PageSize { get; set; } = 15;

	public int GroupSize { get; set; } = 5;

	public int TotalCount { get; set; } = 10000;

	public virtual TSearch Search { get; set; }

	public override string ToString() => JsonConvert.SerializeObject(this);

	public string ToJson() => JsonConvert.SerializeObject(this, Formatting.Indented);
}

public class Pager : Pager<Search>
{
	public override Search Search { get; set; } = Search.Default;
}
