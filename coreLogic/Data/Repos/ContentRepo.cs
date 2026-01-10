using coreApi.Models;
using coreApi.Data.Interfaces;
using coreLogic.Models;
using SeedPacket.Extensions;
using System.Collections.Generic;
using WildHare.Extensions;
using coreApi.Models.Generic;
using coreLogic.Helpers;
using LinqKit;
using System.Linq.Expressions;
using coreLogic.Interfaces;
using Microsoft.AspNetCore.Http;

namespace coreApi.Data;

public class ContentRepo : IContentRepo
{
	public List<Image> GetImages()
	{
		string directoryPath	= @"C:\Git\VueCore\vueapp\public\images";
		string[] fileExtensions	= [".png", ".jpg", ".gif", ".webp"];
		var imageFiles			= new DirectoryInfo(directoryPath)
									.GetFiles("*", SearchOption.TopDirectoryOnly)
									.Where(f => fileExtensions.Any(a => f.Name.EndsWith(a, true)));

		var images = imageFiles.Select(i => new Image { ImageSrc = i.Name, ImageId = Guid.NewGuid() }).ToList();

		return images;
	}

	public PagedList<Image> GetPagedImages(Pager pager)
	{
		var images = GetImages();

		var predicate = BuildPredicate(pager);

		pager.TotalCount = images.Count;
		var listItems	 = images.Where(predicate)
								 .Skip(pager.FirstRecordInPage - 1)
								 .Take(pager.PageSize)
								 .ToList();

		var pagedList = new PagedList<Image>
		{
			ListItems   = listItems,
			Pager       = pager
		};

		return pagedList;
	}

	// =======================================================================================

	private static ExpressionStarter<Image> BuildPredicate(Pager pager, bool search = true)
	{
		// PredicateBuilder with 'search' true (default) means start with all, otherwise will start from empty list.

		var trimAndRemoveEmpty = StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries;

		var predicate = search ? PredicateBuilder.New<Image>(true) : PredicateBuilder.New<Image>();

		string[] filters = pager.Search.Filter.Split(',', trimAndRemoveEmpty);

		foreach (string filter in filters)
		{
			if (filter.IsNullOrSpace())
				continue;

			predicate = predicate.Or(ImageFilter(filter.ToLower()));
		}

		return predicate;
	}

	private static Expression<Func<Image, bool>> ImageFilter(string f)
	{
		return p => p.ImageSrc.Contains(f, true);
	}

}
