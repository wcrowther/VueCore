
// Uses Composition Api-style syntax

export const useAccountsStore = defineStore('AccountsStore', () =>
{
    const toastStore = useToastStore()

    // STATE ------------------------------------------------------------------

    const accountsPager   = ref(new PagerModel(new SearchForAccount()))
    const accountsList    = ref([])
    const account         = ref({})
    const uneditedAccount = ref({})
    const detailAccountId = ref(0)

    // GETTERS ----------------------------------------------------------------

    const accountIsDirty = computed(() =>
        JSON.stringify(account.value) !== JSON.stringify(uneditedAccount.value)
    )

    // ACTIONS ----------------------------------------------------------------

    function addNewAccount()
    {
        account.value = new AccountModel()
    }

    async function getAllAccounts()
    {
        try
        {
            const response = await apiGet(`/accounts/getAllAccounts`)
            if (response.success)
                accountsList.value = response.data.Result.ListItems
        }
        catch (err)
        {
            toastStore.showError(err.message)
        }
    }

    async function getPagedAccounts(pager)
    {
        try
        {
            console.log('--- Get AccountList From Server')
            const response = await apiPost(`/accounts/getPagedAccounts`, pager)

            if (response.success)
            {
                accountsPager.value =
                    PagerModel.fromJson(response.data.Result.Pager, () => new SearchForAccount())

                accountsList.value =
                    response.data.Result.ListItems.map(item =>
                        Object.assign(new AccountModel(), item)
                    )
            }
        }
        catch (err)
        {
            toastStore.showError(err.message)
        }
    }

    async function getAccountDetailData(accountId)
    {
        try
        {
            if (accountId && accountId > 0)
            {
                console.log(`------- Get AccountDetail ${accountId} From Server`)
                const result = await apiGet(`/accounts/getAccountById/${accountId}`)

                if (result.success)
                {
                    account.value         = Object.assign(new AccountModel(), result.data.Result)              
                    uneditedAccount.value = structuredClone(toRaw(account.value))
                    return
                }
            }

            account.value         = new AccountModel()
            uneditedAccount.value = new AccountModel()
        }
        catch (err)
        {
            toastStore.showError(err.message)
        }
    }

    async function saveAccount()
    {
        try
        {
            const result = await apiPost(`/accounts/saveAccount/`, account.value)

            if (result.success)
            {
                account.value         = result.data.Result
                uneditedAccount.value = structuredClone(toRaw(account.value))

                toastStore.showSuccess('Account Saved Successfully.')
            }
        }
        catch (err)
        {
            toastStore.showError(err.message)
        }
    }

    function resetAccount()
    {
        account.value = Object.assign(new AccountModel(), uneditedAccount.value)
    }

    // EXPOSE PUBLIC API ------------------------------------------------

    return {
        // state
        accountsPager,
        accountsList,
        account,
        uneditedAccount,
        detailAccountId,

        // getters
        accountIsDirty,

        // actions
        addNewAccount,
        getAllAccounts,
        getPagedAccounts,
        getAccountDetailData,
        saveAccount,
        resetAccount
    }
})
