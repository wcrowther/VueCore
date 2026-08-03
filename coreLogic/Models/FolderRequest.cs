namespace coreLogic.Models;

public record FolderRequest(string ParentPath, string Name);

public sealed record RenameFolderRequest(string ParentPath, string OldName, string NewName);
