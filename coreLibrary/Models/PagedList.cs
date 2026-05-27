namespace coreLibrary.Models;

public class PagedList<T, TSearch>
{
	public Pager<TSearch> Pager { get; set; } = new Pager<TSearch>();

	public List<T> ListItems { get; set; } = [];

	public Returns Result { get; set; }
}

public class PagedList<T> : PagedList<T, Search> { }
