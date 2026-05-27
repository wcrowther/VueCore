namespace coreLibrary.Models;

public class Returns<T>(T data = default, Error error = null)
{
	public T Data { get => data; }

	public Error Error { get => error; }

	public bool Ok => Error is null;

	public bool HasData => Data is not null;

	public static Returns<T> Success(T data)
		=> new(data);

	public static Returns<T> Result(T data, string ifErrorMessage = "No data returned.")
		=> data is not null ? new(data) : Failure(ifErrorMessage);

	public static Returns<T> Result(T data, Func<T, bool> func, string ifErrorMessage)
		=> func(data) ? new(data) : Failure(ifErrorMessage);

	public static Returns<T> Failure(string ifErrorMessage)
		=> new(error: new Error(ifErrorMessage));

	public static Returns<T> Failure(Error error) => new(error: error);

	public static Returns<T> Failure(Exception exception) => new(error: exception);

	public static implicit operator Returns<T>(Error error) => Failure(error);

	public static implicit operator Returns<T>(Exception exception) => Failure(exception);
}

public class Returns(string data = null, Error error = null) : Returns<string>(data, error)
{
	public static new Returns Success(string data = "")
		=> new(data);

	public static new Returns Result(string data, string ifErrorMessage = "No data returned.")
		=> data is not null ? new(data) : Failure(ifErrorMessage);

	public static new Returns Result(string data, Func<string, bool> func, string ifErrorMessage)
		=> func(data) ? new(data) : Failure(ifErrorMessage);

	public static new Returns Failure(string ifErrorMessage)
		=> new(error: new Error(ifErrorMessage));

	public static new Returns Failure(Error error)
		=> new(error: error);

	public static new Returns Failure(Exception exception)
		=> new(error: exception);

	public static implicit operator Returns(Error error) => Failure(error);

	public static implicit operator Returns(Exception exception) => Failure(exception);

	public override string ToString() => Ok ? Data.ToString() ?? "" : Error.Message;
}
