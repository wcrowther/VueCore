using coreApi.Helpers;
using coreApi.Hubs;
using coreLogic.Interfaces;
using coreLogic.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace coreApi;

public static partial class Endpoints
{
    public static void MessageEndpoints(this WebApplication app)
    {
        var endpoints = app.MapGroup("/v1/messages")
							.RequireAuthorization()
							.WithOpenApi()
							.WithTags("Messages");

		endpoints.MapGet("/getAllMessages", (IMessageManager _messageManager) =>
		{
			var messages = _messageManager.GetAllMessages();

			return Results.Ok(messages);
		});

		endpoints.MapGet("/getMaxMessageId", (IMessageManager _messageManager) =>
		{
			var maxMessageId = _messageManager.GetMaxMessageId();

			return Results.Ok(maxMessageId);
		});

		endpoints.MapPost("/saveMessage", (	IMessageManager _messageManager,
										IHubContext<ChatHub> hubContext,
										[FromBody] MessageVm message) =>
		{
			var savedMessage = _messageManager.SaveMessage(message);

			// Send out message from the server here instead of from ChatHub call from client
			hubContext.SendMessageFromServer(savedMessage.Result);

			// Update max MessageId to all clients
			hubContext.SendMaxMessageId(savedMessage.Result.MessageId);

			return Results.Ok(savedMessage); 
		})
		.Validate<MessageVm>(false);
	}
}

