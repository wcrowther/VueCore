using coreData.Interfaces;
using coreData.Models;
using coreLogic.Adapters;
using coreLogic.Interfaces;
using coreLogic.Models;

namespace coreLogic.Managers;

public class MessageManager(IMessageRepo messageRepo, IUserRepo userRepo)
    : IMessageManager
{
    public async Task<List<MessageVm>> GetAllMessages()
    {
        var messages = await messageRepo.GetAllMessages();
        return messages.ToMessageVmList();
    }

    public async Task<int> GetMaxMessageId()
    {
        return await messageRepo.GetMaxMessageId();
    }

    public async Task<MessageVm> SaveMessage(MessageVm messageVm)
    {
        var message = messageVm.ToMessage();
        var saved   = await messageRepo.SaveMessage(message);
        PopulateAuditableNames(saved);
        return saved.ToMessageVm();
    }

    // ==========================================================================================

    private void PopulateAuditableNames(Message message)
    {
        if (message is null) return;

        message.CreatorName = userRepo.GetUsernameById(message.CreatorId);

        if (message.CreatorId == message.ModifierId)
            message.ModifierName = message.CreatorName;
        else
            message.ModifierName = userRepo.GetUsernameById(message.ModifierId);
    }
}
