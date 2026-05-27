using System.Text;
using WildHare.Extensions;

namespace coreLibrary.Helpers;

public static class Extensions
{
	// Generic helper method
	public static List<TTarget> ToList<TSource, TTarget>(this IEnumerable<TSource> source, Func<TSource, TTarget> converter)
	{
		return source?.Select(converter).ToList() ?? [];
	}

	public static bool IsNumeric(this string input)
	{
		if (input.IsNullOrSpace()) return false;

		foreach (char c in input)
		{
			if (!c.IsDigit()) return false;
		}
		return true;
	}

	public static string[] Split(this string str, string separator, bool removeEmptyEntries, bool trimEntries = true)
	{
		if (str.IsNullOrEmpty())
			return [];

		StringSplitOptions options = trimEntries ? StringSplitOptions.TrimEntries : StringSplitOptions.None;
		options |= removeEmptyEntries ? StringSplitOptions.RemoveEmptyEntries : StringSplitOptions.None;

		return str.Split(separator, options);
	}

	public static byte[] ToUtf8Bytes(this string str)
	{
		return Encoding.UTF8.GetBytes(str);
	}
}
