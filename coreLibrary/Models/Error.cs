namespace coreLibrary.Models;

public class Error(string message, Error innerError = null)
{
	public string Message { get => message; }

	public Error InnerError { get => innerError; }

	public static implicit operator Error(Exception ex)
		=> new Error(ex.Message, ex.InnerException);
}
