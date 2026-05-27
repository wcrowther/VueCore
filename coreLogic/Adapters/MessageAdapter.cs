using coreApi.Models;
using coreLogic.Helpers;
using Microsoft.Extensions.DependencyInjection;

namespace coreLogic.Adapters;

public static partial class Adapter
{
	public static MessageDto ToMessageDto(this Message message) 
	{
		return message == null ? null :
			new MessageDto
			(
				message.MessageId,
				message.MessageText,
				message.CreatorName,
				message.DateCreated
			);
	}

	public static List<MessageDto> ToMessageDtoList(this IEnumerable<Message> messages) => messages.ToList(a => a.ToMessageDto());
}