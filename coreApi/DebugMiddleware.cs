using coreLogic.Models;
using coreLibrary.Helpers;
using Microsoft.AspNetCore.Http;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using WildHare.Extensions;
using static System.Diagnostics.Debug;

namespace coreApi
{
	public class DebugMiddleware
	{
		// -------------------------------------
		// USAGE in Program.cs:
		// -------------------------------------
		// app.UseMiddleware<DebugMiddleware>();

		private readonly RequestDelegate _next;

		public DebugMiddleware(RequestDelegate next)
		{
			_next = next;
		}

		public async Task Invoke(HttpContext httpContext, AppSettings app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{ 
				// Useful for intercepting the raw request, especially if model binding, etc. goes wrong...
				WriteLine("=".Repeat(100));
				WriteLine($"DebugMiddleware ({httpContext.Request.Method}) {env.EnvironmentName} request for {httpContext.Request.Path} ");
				WriteLine($"Received ({httpContext.Request.ContentLength ?? 0} bytes) at {DateTime.Now}");

				if (app.ShowJsonPostDebug && 
					(httpContext.Request.Method == HttpMethods.Post || httpContext.Request.Method == HttpMethods.Put)
					&& IsJsonRequest(httpContext))
				{
					// Enable buffering so the body can be read multiple times
					httpContext.Request.EnableBuffering();

					// Read the request body stream as string
					httpContext.Request.Body.Position = 0;

					using var reader = new StreamReader
					(
						httpContext.Request.Body,
						encoding:							Encoding.UTF8,
						detectEncodingFromByteOrderMarks:	false,
						bufferSize:							1024,
						leaveOpen:							true  // leave it open
					);

					var body = await reader.ReadToEndAsync();

					// Reset the stream position for the next middleware/controller
					httpContext.Request.Body.Position = 0;

					WriteLine($"Request JSON Body");
					WriteLine("-".Repeat(100));
					WriteLine($"{body.MaskJsonSecrets("password","secret","token")}");
				}
			}

			// Call the next middleware delegate in the pipeline 
			await _next.Invoke(httpContext);
		}

		private static bool IsJsonRequest(HttpContext httpContext)
		{
			return httpContext.Request.ContentType?.Contains("application/json", StringComparison.OrdinalIgnoreCase) == true;
		}
	}
}


