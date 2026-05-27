
namespace coreLogic.Models;

public record FileRequest(string FolderPath, string FileName);

public sealed record RenameFileRequest(string FolderPath, string OldName, string NewName);

public sealed record DeleteFilesRequest(string FolderPath, List<string> FileNames);

public sealed record MoveFilesRequest(string SourcePath, string TargetPath, List<string> FileNames);

public sealed record MoveFileFailure(string FileName, string Reason);

public sealed record MoveFilesResult(bool Success, int MovedCount, List<string> MovedFiles, List<MoveFileFailure> FailedFiles);
