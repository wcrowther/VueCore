
export const useUsersStore = defineStore('UsersStore',
{
    state: () => 
    ({
        usersPager:      new PagerModel(new SearchForUser),
        usersList:       [],
        user:            new UserModel(),
        detailUserId:    0
    }),
    getters:{},
    actions:
    {
        addNewUser()
        {
            this.user = new UserModel()
        },
        async getPagedUsers (pager)
        {
            try 
            {
                console.log('--- >>> Get UsersList From Server')
                
                const result = await apiPost(`/users/getPagedUsers`, pager)
                
                if(result.success) 
                {
                    this.usersPager  = PagerModel.fromJson(result.data.Pager, () => new SearchForUser()) 
                    this.usersList   = result.data.ListItems   
                }
            }
            catch (err){ useToastStore().showError(err.message) }
        },
        async getUserDetailData (userId)
        {
            try 
            {
                if(userId && userId > 0)
                {
                    const result = await apiGet(`/users/getUserById/${userId}`)
                    
                    if(result.success) 
                        this.user = result.data
                }
            } 
            catch (err) {  useToastStore().showError(err.message) }
        },
        async saveUser ()
        {
            try 
            {
                const result = await apiPost(`/users/saveUser/`, this.user)

                if(result.success) 
                {
                    this.user = result.data

                    console.log('User Saved Succesfully.')
                    useToastStore().showSuccess('User Saved Successfully.')
                }
            } 
            catch (err)
            { 
                useToastStore().showError(err.message) 
            }
        }
    }
})

