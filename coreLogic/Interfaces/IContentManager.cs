using coreData.Models;
using coreLibrary.Models;

namespace coreLogic.Interfaces;

public interface IContentManager
{
	Task<List<Image>> GetImages();

	Task<PagedList<Image>> GetPagedImages(Pager pager);
}
