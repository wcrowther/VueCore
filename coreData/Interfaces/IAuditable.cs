namespace coreData.Interfaces;

public interface IAuditable
{
	DateTime DateCreated { get; set; }

	DateTime DateModified { get; set; }

	int CreatorId { get; set; }

	int ModifierId { get; set; }
}
