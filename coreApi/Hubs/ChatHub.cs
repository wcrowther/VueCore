using coreLogic.Models;
using Microsoft.AspNetCore.SignalR;

namespace coreApi.Hubs;

public class ChatHub : Hub
{
	public async Task SendMessage(MessageVm message)
	{
		await Clients.All.SendAsync("ReceiveMessage", message);
	}
}
