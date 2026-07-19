using coreData.Models;
using coreLibrary.Helpers;
using coreLogic.Models;

namespace coreLogic.Adapters;

public static partial class Adapter
{
	public static MessageVm ToMessageVm(this Message message)
	{
		return message == null ? null :
			new MessageVm
			{
				MessageId    = message.MessageId,
				MessageText  = message.MessageText,
				DateCreated  = message.DateCreated,
				DateModified = message.DateModified,
				CreatorId    = message.CreatorId,
				ModifierId   = message.ModifierId,
				CreatorName  = message.CreatorName,
				ModifierName = message.ModifierName
			};
	}

	public static List<MessageVm> ToMessageVmList(this IEnumerable<Message> messages) => messages.ToList(m => m.ToMessageVm());

	public static Message ToMessage(this MessageVm vm)
	{
		return vm == null ? null :
			new Message
			{
				MessageId    = vm.MessageId,
				MessageText  = vm.MessageText,
				DateCreated  = vm.DateCreated,
				DateModified = vm.DateModified,
				CreatorId    = vm.CreatorId,
				ModifierId   = vm.ModifierId
			};
	}
}
