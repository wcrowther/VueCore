namespace coreLogic.Models;

public class MessageVm
{
	public int MessageId { get; set; }
	public string MessageText { get; set; } = "";
	public DateTime DateCreated { get; set; }
	public DateTime DateModified { get; set; }
	public int CreatorId { get; set; }
	public int ModifierId { get; set; }
	public string CreatorName { get; set; }
	public string ModifierName { get; set; }

	public override string ToString() => $"{MessageId} UserId: {CreatorId} Text: {MessageText}";
}
