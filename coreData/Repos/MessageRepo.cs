using coreData.Interfaces;
using coreData.Models;
using Microsoft.EntityFrameworkCore;

namespace coreData.Repos;

public class MessageRepo(DataContext context) : IMessageRepo
{
	int maxMessages = 20;

	public async Task<List<Message>> GetAllMessages()
	{
		// var messageList = await context.Messages.ToListAsync();

		var messageList = await (
						from m in context.Messages
						join u in context.Users
						  on m.CreatorId equals u.UserId
						join u2 in context.Users
							on m.ModifierId equals u2.UserId
						select new Message
						{
							MessageId    = m.MessageId,
							MessageText  = m.MessageText,
							DateCreated  = m.DateCreated,
							DateModified = m.DateModified,
							CreatorId    = m.CreatorId,
							CreatorName  = u.UserName,
							ModifierName = u2.UserName,
							ModifierId   = m.ModifierId,
						}
						).ToListAsync();

		if (messageList.Count >= maxMessages)
		{
			DeleteOldMessages();
		}

		return messageList;
	}

	public async Task<int> GetMaxMessageId()
	{
		int maxMessageId = await context.Messages.MaxAsync(m => m.MessageId);

		return maxMessageId;
	}

	public async Task<Message> SaveMessage(Message message)
	{
		context.Update(message);
		await context.SaveChangesAsync();

		return message;
	}

	// ============================================================

	private async void DeleteOldMessages()
	{
		var recentMessageIds = await context.Messages
							.OrderByDescending(e => e.DateCreated)
							.Take(maxMessages)
							.Select(e => e.MessageId)
							.ToListAsync();

		await context.Messages
			.Where(e => !recentMessageIds.Contains(e.MessageId))
			.ExecuteDeleteAsync();

		await context.SaveChangesAsync();
	}
}
