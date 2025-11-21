
const toastStore  = useToastStore()

export const useAccountsStore = defineStore('AccountsStore',
{
    state: () => 
    ({
        accountsPager:      new PagerModel(new SearchForAccount()),
        accountsList:       [],
        account:            {},
        uneditedAccount:    {},
        detailAccountId:    0
    }),
    getters:
    {
        accountIsDirty: (state) =>  JSON.stringify(state.account) !== JSON.stringify(state.uneditedAccount)  
    },
    actions:
    {
        addNewAccount()
        {
            this.account   = new AccountModel()
        },
        async getAllAccounts ()
        {
            try 
            {
                const response = await apiGet(`/accounts/getAllAccounts`)                
                if(response.success) 
                {    
                    this.accountsList   = response.data.Result.ListItems   
                }
            }
            catch (err) { toastStore.showError(err.message) }
        },
        async getPagedAccounts (pager)
        {
            try 
            {
                console.log('--- Get AccountList From Server') // logJson('getPagedAccounts request', JSON.stringify(pager))
                const response = await apiPost(`/accounts/getPagedAccounts`, pager)
                
                if(response.success) 
                {
                    this.accountsPager = PagerModel.fromJson(response.data.Result.Pager, () => new SearchForAccount()) 
                    this.accountsList  = response.data.Result.ListItems.map(item => Object.assign(new AccountModel, item))

                    // OLD: this.accountsPager  = Object.assign(new PagerModel(new SearchForAccount(), response.data.Result.Pager)
                    // OLD: this.accountsList   = response.data.Result.ListItems   
                }
            }
            catch (err){ toastStore.showError(err.message) }
        },
        async getAccountDetailData (accountId)
        {
            try 
            {
                if(accountId && accountId > 0)
                {
                    console.log(`------- Get AccountDetail ${accountId} From Server`)
                    const result = await apiGet(`/accounts/getAccountById/${accountId}`)
                    
                    if(result.success)
                    {
                        this.account         = result.data.Result
                        this.uneditedAccount = structuredClone(toRaw(this.account))
                        return
                    }
                }

                this.account            = new AccountModel()
                this.uneditedAccount    = new AccountModel()
            } 
            catch (err) { toastStore.showError(err.message) } 
        },
        async saveAccount ()
        {
            try 
            {
                const result = await apiPost(`/accounts/saveAccount/`, this.account)

                if(result.success) 
                {
                    this.account           = result.data.Result
                    this.uneditedAccount   = structuredClone(toRaw(this.account ))

                    toastStore.showSuccess('Account Saved Successfully.')
                }
            } 
            catch (err){ toastStore.showError(err.message) }
        },
        async resetAccount ()
        {
            this.account = Object.assign(new AccountModel(), this.uneditedAccount)
        }
    }
})



// =======================================================================================
// ALTERNATE SYNTAX
// =======================================================================================
// {
//     console.log('getPagedAccounts: ') 
//     
//     this.isBusy  = true
//     let queryUrl = `${baseApiUrl}/accounts/getPagedAccounts`
// 
//     axios.post(queryUrl, pager, axiosConfig) 
//     .then((result) => 
//     {
//         this.accountsPager    = Object.assign(new PagerModel(), result.data.pager)
//         this.accountsList     = result.data.listItems // NOTE: casing of listItems  
// 
//         console.log(JSON.parse(JSON.stringify(this.accountsPager))) 
//         console.log(JSON.parse(JSON.stringify(this.accountsList))) 
//     })
//     .catch((err) => 
//     {
//         console.error(err) 
//         this.error = err
//     })
//     .finally(() => { this.isBusy = false })
// },
// =======================================================================================

// WITH DEBUGGING
// getters:
// {
//     accountIsDirty: (state)  => 
//     {   
//          let dirty = JSON.stringify(state.account) !== JSON.stringify(state.uneditedAccount); 
//          console.log(`accountIsDirty: ${dirty} account: `, 
//          JSON.stringify(state.account.AccountName), 'uneditedAccount: ', JSON.stringify(state.uneditedAccount.AccountName) ); 
//          return dirty 
//     }          
// }