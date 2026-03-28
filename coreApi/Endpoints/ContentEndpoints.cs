using coreApi.Helpers;
using coreApi.Logic.Interfaces;
using coreApi.Models;
using coreApi.Models.Generic;
using coreLogic.Interfaces;
using coreLogic.Managers;
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

		// ---- Legacy Image Endpoints  -------------------------------------------------------------------

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

		// ---- Uploads Endpoints --------------------------------------------------------------------------

		endpoints.MapPost("/upload", async (IFormFile file, AppSettings appSettings) =>
		{
			string uploadsPath = Path.Combine(appSettings.FoldersRoot, "Uploads");
			var uploadsFolder  = Directory.CreateDirectory(uploadsPath); // Ensure Uploads exists

			var path = Path.Combine(uploadsPath, file.FileName);

			using var stream = new FileStream(path, FileMode.Create);
			await file.CopyToAsync(stream);

			return Results.Ok(new { file = file.FileName });
		})
		.DisableAntiforgery()  // WORK ON THIS. This required for current security implementation.
		.WithName("Upload");

		// ---- File Endpoints ------------------------------------------------------------------------------

		endpoints.MapGet("/folders", (FolderManager folderManager) =>
		{
			return Results.Ok(folderManager.GetTree());
		});

		endpoints.MapPost("/folders", ([FromBody] FolderRequest req, [FromServices] FolderManager folderManager) =>
		{
			folderManager.CreateFolder(req.ParentPath, req.Name);
			return Results.Ok();
		});

		endpoints.MapDelete("/folders", ([FromBody] FolderRequest req, [FromServices] FolderManager folderManager) =>
		{
			folderManager.DeleteFolder(req.ParentPath, req.Name);
			return Results.Ok();
		});

		endpoints.MapPut("/renamefolder", ([FromBody] RenameFolderRequest request, [FromServices] FolderManager folderManager) =>
		{
			folderManager.RenameFolder(request.ParentPath, request.OldName, request.NewName);
			return Results.Ok();
		});

		// ---- File Endpoints ------------------------------------------------------------------------------

		endpoints.MapGet("/files/{*folderPath}", ([FromServices] FileManager fileManager, string folderPath) =>
		{
			var results = fileManager.GetFiles(folderPath);

			return results is null
						? Results.NotFound(new { message = "Folder not found" })
						: Results.Ok(results);
		})
		.WithName("GetFiles");

		endpoints.MapPut("/renamefile", ([FromBody] RenameFileRequest request, [FromServices] FileManager fileManager) =>
		{
			fileManager.RenameFile(request.FolderPath, request.OldName, request.NewName);
			return Results.Ok();
		})
		.WithName("RenameFile");

		endpoints.MapDelete("/files", ([FromBody] DeleteFilesRequest request, [FromServices] FileManager fileManager) =>
		{
			fileManager.DeleteFiles(request.FolderPath, request.FileNames);
			return Results.Ok();
		})
		.WithName("DeleteFiles");
	}
}
