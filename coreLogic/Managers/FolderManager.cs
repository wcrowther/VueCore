using coreLogic.Models;
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

			if (!Directory.Exists(newPath))
				Directory.CreateDirectory(newPath);
		}

		public void DeleteFolder(string parentPath, string name)
		{
			ValidateName(name);

			var fullParent = ResolvePath(parentPath);
			var path = Path.Combine(fullParent, name);

			if (!Directory.Exists(path))
				return;

			if (ContainsFiles(path))
				throw new InvalidOperationException($"Cannot delete folder '{name}' because it or its subfolders contain files");

			Directory.Delete(path, true);
		}

		public void RenameFolder(string parentPath, string oldName, string newName)
		{
			ValidateName(oldName);
			ValidateName(newName);

			var fullParent = ResolvePath(parentPath);
			var oldPath = Path.Combine(fullParent, oldName);
			var newPath = Path.Combine(fullParent, newName);

			if (!Directory.Exists(oldPath))
				throw new DirectoryNotFoundException($"Folder '{oldName}' not found");

			if (Directory.Exists(newPath))
				throw new IOException($"Folder '{newName}' already exists");

			Directory.Move(oldPath, newPath);
		}

		// =============================================================================

		private List<FolderNode> GetChildren(string path)
		{
			return Directory.GetDirectories(path)
				.Select(dir => new FolderNode
				{
					Name      = Path.GetFileName(dir),
					FileCount = Directory.GetFiles(dir).Length,
					Children  = GetChildren(dir)
				})
				.ToList();
		}

		private bool ContainsFiles(string path)
		{
			return Directory.EnumerateFiles(path, "*", SearchOption.AllDirectories).Any();
		}

		private string ResolvePath(string relative)
		{
			if (string.IsNullOrWhiteSpace(relative))
				return foldersRoot;

			if (relative.Contains(".."))
				throw new Exception("Invalid path");

			relative = relative.Trim();
			relative = relative.Trim('\\', '/');

			// Ensure foldersRoot is absolute before combining
			var absoluteRoot = Path.GetFullPath(foldersRoot);
			var full = Path.GetFullPath(Path.Combine(absoluteRoot, relative));

			if (!full.StartsWith(absoluteRoot, StringComparison.OrdinalIgnoreCase))
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
