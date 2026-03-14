using coreApi.Helpers;
using coreApi.Logic.Interfaces;
using coreApi.Models;
using coreApi.Models.Generic;
using coreLogic.Interfaces;
using coreLogic.Models;
using Microsoft.AspNetCore.Mvc;
using WildHare.Extensions;

namespace coreApi;

public static partial class Endpoints
{
	public static void ContentEndpoints(this WebApplication app)
	{
		var endpoints = app.MapGroup("/v1/content")
					  .WithOpenApi()
					  .WithTags("Content");

		endpoints.MapPost("/getimages", (IContentManager _contentManager) =>
		{
			var results = _contentManager.GetImages();

			return results == null ?
						Results.Unauthorized() :
						Results.Ok(results);
		})
		.WithName("GetImages");

		endpoints.MapPost("/getPagedImages", (IContentManager _contentManager, [FromBody] Pager pager) =>
		{
			var results = _contentManager.GetPagedImages(pager);

			return results == null ?
						Results.Unauthorized() :
						Results.Ok(results);
		})
		.WithName("GetPagedImages");

		endpoints.MapPost("/upload", async (IFormFile file) =>
		{
			var path = Path.Combine("Uploads", file.FileName);

			using var stream = new FileStream(path, FileMode.Create);
			await file.CopyToAsync(stream);

			return Results.Ok(new { file = file.FileName });
		})
		.DisableAntiforgery()  // WORK ON THIS
		.WithName("Upload");
	}
}
