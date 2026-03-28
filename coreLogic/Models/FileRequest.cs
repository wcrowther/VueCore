
namespace coreApi.Models;

public record FileRequest(string FolderPath, string FileName);

public sealed record RenameFileRequest(string FolderPath, string OldName, string NewName);

public sealed record DeleteFilesRequest(string FolderPath, List<string> FileNames);
