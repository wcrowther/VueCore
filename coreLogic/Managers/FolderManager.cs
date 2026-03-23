using coreApi.Models;
using coreLogic.Interfaces;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace coreLogic.Managers
{
	public class FolderManager
	{
		private readonly string foldersRoot;
	
		private static readonly Regex ValidName = new(@"^[a-zA-Z0-9_\- ]+$", RegexOptions.Compiled);

		public FolderManager(string foldersRoot)
		{
			this.foldersRoot = foldersRoot ?? @"C:\FoldersRoot";

			if (!Directory.Exists(foldersRoot))
				Directory.CreateDirectory(foldersRoot);
		}

		public List<FolderNode> GetTree() => GetChildren(foldersRoot);

		public void CreateFolder(string parentPath, string name)
		{
			ValidateName(name);

			var fullParent = ResolvePath(parentPath);

			var newPath = Path.Combine(fullParent, name);

			Debug.WriteLine(newPath);

			if (!Directory.Exists(newPath))
				Directory.CreateDirectory(newPath);
		}

		public void DeleteFolder(string parentPath, string name)
		{
			ValidateName(name);

			var fullParent = ResolvePath(parentPath);
			var path = Path.Combine(fullParent, name);

			if (Directory.Exists(path))
				Directory.Delete(path, true);
		}

		// =============================================================================

		private List<FolderNode> GetChildren(string path)
		{
			return Directory.GetDirectories(path)
				.Select(dir => new FolderNode
				{
					Name = Path.GetFileName(dir),
					Children = GetChildren(dir)
				})
				.ToList();
		}

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
				throw new Exception("Invalid folder name");
		}
	}
}
