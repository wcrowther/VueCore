
export default class AccountModel 
{
    constructor() 
    {
        this.AccountId = 0;
        this.AccountName = '';
        this.AccountEmail = '';
        this.AccountPhone = '';
        this.StreetAddress = '';
        this.City = '';
        this.StateProvince = '';
        this.PostalCode = '';
        this.IsInvoice = false;
        this.IsAutoPay = false;
        this.IsActive = false;
        this.CreatedDate = null;
        this.ModifiedDate = null;
        this.CreatorId = 0;
        this.ModifierId = 0;
        this.CreatorName = '';
        this.ModifierName = '';
    }
}
