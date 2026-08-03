using coreData.Models;
using coreLibrary.Models;

namespace coreData.Interfaces;

public interface IContentRepo
{
	List<Image> GetImages();

	PagedList<Image> GetPagedImages(Pager pager);
}

