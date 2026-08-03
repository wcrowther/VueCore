using coreData.Interfaces;
using coreData.Models;
using coreLibrary.Models;
using coreLogic.Interfaces;

namespace coreLogic.Managers;

public class ContentManager( IContentRepo contentRepo) 
: IContentManager
{
	public async Task<List<Image>> GetImages()
	{
		return await Task.FromResult(contentRepo.GetImages());
	}

	public async Task<PagedList<Image>> GetPagedImages(Pager pager)
	{
		return await Task.FromResult(contentRepo.GetPagedImages(pager));
	}
}
