using coreApi.Models;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;

namespace coreLogic.Managers
{
	public class FileManager
	{
		private readonly string foldersRoot;
		private readonly string uploadsPath;

		private static readonly Regex ValidName = new(@"^[a-zA-Z0-9_\-. ]+$", RegexOptions.Compiled);

		public FileManager(string foldersRoot)
		{
			this.foldersRoot = foldersRoot ?? @"C:\FoldersRoot";
			this.uploadsPath = Path.Combine(this.foldersRoot, "Uploads");

			if (!Directory.Exists(foldersRoot))
				Directory.CreateDirectory(foldersRoot);

			if (!Directory.Exists(uploadsPath))
				Directory.CreateDirectory(uploadsPath);
		}

		public List<FileItem> GetFiles(string folderPath)
		{
			var decoded = Uri.UnescapeDataString(folderPath ?? string.Empty);

			var fullPath = ResolvePath(decoded);

			if (!Directory.Exists(fullPath))
				return null;

			return Directory.GetFiles(fullPath)
				.Select(f => new FileInfo(f))
				.Select(fi => new FileItem
				{
					Name         = fi.Name,
					Extension    = fi.Extension,
					Size         = fi.Length,
					LastModified = fi.LastWriteTimeUtc
				})
				.OrderBy(f => f.Name)
				.ToList();
		}

		public void RenameFile(string folderPath, string oldName, string newName)
		{
			ValidateName(oldName);
			ValidateName(newName);

			var fullFolder = ResolvePath(folderPath);
			var oldPath    = Path.Combine(fullFolder, oldName);
			var newPath    = Path.Combine(fullFolder, newName);

			if (!File.Exists(oldPath))
				throw new FileNotFoundException($"File '{oldName}' not found");

			if (File.Exists(newPath))
				throw new IOException($"File '{newName}' already exists");

			File.Move(oldPath, newPath);
		}

		public void DeleteFile(string folderPath, string fileName)
		{
			ValidateName(fileName);

			var fullFolder = ResolvePath(folderPath);
			var path       = Path.Combine(fullFolder, fileName);

			if (File.Exists(path))
				File.Delete(path);
		}

		public void DeleteFiles(string folderPath, List<string> fileNames)
		{
			foreach (var fileName in fileNames)
			{
				DeleteFile(folderPath, fileName);
			}
		}

		public async Task<string> UploadFile(IFormFile file)
		{
			ValidateName(file.FileName);

			var path = Path.Combine(uploadsPath, file.FileName);

			using var stream = new FileStream(path, FileMode.Create);
			await file.CopyToAsync(stream);

			return file.FileName;
		}

		public MoveFilesResult MoveFiles(string sourcePath, string targetPath, List<string> fileNames)
		{
			var sourceDir = ResolvePath(sourcePath);
			var targetDir = ResolvePath(targetPath);

			if (!Directory.Exists(sourceDir))
				throw new DirectoryNotFoundException($"Source folder not found");

			if (!Directory.Exists(targetDir))
				throw new DirectoryNotFoundException($"Target folder not found");

			var movedFiles  = new List<string>();
			var failedFiles = new List<MoveFileFailure>();

			foreach (var fileName in fileNames)
			{
				try
				{
					ValidateName(fileName);

					var srcFile = Path.Combine(sourceDir, fileName);
					var dstFile = Path.Combine(targetDir, fileName);

					if (!File.Exists(srcFile))
					{
						failedFiles.Add(new MoveFileFailure(fileName, "File not found in source folder"));
						continue;
					}

					if (File.Exists(dstFile))
					{
						failedFiles.Add(new MoveFileFailure(fileName, "File already exists in target folder"));
						continue;
					}

					File.Move(srcFile, dstFile);
					movedFiles.Add(fileName);
				}
				catch (Exception ex)
				{
					failedFiles.Add(new MoveFileFailure(fileName, ex.Message));
				}
			}

			return new MoveFilesResult(
				failedFiles.Count == 0,
				movedFiles.Count,
				movedFiles,
				failedFiles
			);
		}

		// =============================================================================

		private string ResolvePath(string relative)
		{
			if (string.IsNullOrWhiteSpace(relative))
				return foldersRoot;

			if (relative.Contains(".."))
				throw new Exception("Invalid path");

			var full = Path.GetFullPath(Path.Combine(foldersRoot, relative));

			if (!full.StartsWith(foldersRoot))
				throw new Exception("Path escape detected");

			return full;
		}

		private void ValidateName(string name)
		{
			if (!ValidName.IsMatch(name))
				throw new Exception("Invalid file name");
		}
	}
}
