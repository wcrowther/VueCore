namespace coreLogic.Models;

public class Address
{
    public string StreetAddress { get; set; }

	public string City { get; set; }

	public string StateProvince { get; set; }

	public string PostalCode { get; set; }

	public override string ToString() => $"{StreetAddress} {City} {StateProvince} {PostalCode}";

}
