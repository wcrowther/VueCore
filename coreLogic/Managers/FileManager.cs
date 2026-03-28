using coreApi.Models;
using System.Text.RegularExpressions;

namespace coreLogic.Managers
{
	public class FileManager
	{
		private readonly string foldersRoot;

		private static readonly Regex ValidName = new(@"^[a-zA-Z0-9_\-. ]+$", RegexOptions.Compiled);

		public FileManager(string foldersRoot)
		{
			this.foldersRoot = foldersRoot ?? @"C:\FoldersRoot";

			if (!Directory.Exists(foldersRoot))
				Directory.CreateDirectory(foldersRoot);
		}

		public List<FileItem> GetFiles(string folderPath)
		{
			var fullPath = ResolvePath(folderPath);

			if (!Directory.Exists(fullPath))
				throw new DirectoryNotFoundException($"Folder not found");

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
