using coreLogic.Models;

namespace coreLogic.Interfaces;

public interface IMessageManager
{
    Task<List<MessageVm>> GetAllMessages();

    Task<int> GetMaxMessageId();

    Task<MessageVm> SaveMessage(MessageVm message);
}
