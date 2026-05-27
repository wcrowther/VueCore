using coreData.Models;

namespace coreData.Interfaces;

public interface IMessageRepo
{
	Task<List<Message>> GetAllMessages();

	Task<int> GetMaxMessageId();

	Task<Message> SaveMessage(Message message);
}
