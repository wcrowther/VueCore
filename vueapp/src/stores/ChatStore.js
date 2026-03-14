export const useChatStore = defineStore('ChatStore',
{
    state: () => 
    ({
        message: {},
        messages: [],
        clientMaxMessageId: 0,
        serverMaxMessageId: 0
    }),
    getters:
    {
        messagesCount: (state) => state.serverMaxMessageId - state.clientMaxMessageId,
        getMaxMessageIdFromMessages: (state) =>  
        {
            if (state.messages.length === 0) return 0;

            return state.messages.reduce((max, msg) => 
                msg.MessageId > max ? msg.MessageId : max, 
                0
            );
        }
    },
    actions:
    {
        async addNewMessage(userId, messageText)
        {
            this.message = new MessageModel(userId, messageText)
        },
        async getAllMessages ()
        {
            try 
            {
                console.log('--- >>> Get All Messages From Server')
                
                const result = await apiGet(`/messages/getAllMessages`)
                
                if(result.success)
                {
                    this.messages           = result.data.Result
                    this.clientMaxMessageId = this.getMaxMessageIdFromMessages
                    this.serverMaxMessageId = this.clientMaxMessageId
                } 
            }
            catch (err){ useToastStore().showError(err.message) }
        },        
        async getMaxMessageId ()
        {
            try 
            {        
                const result = await apiGet(`/messages/getMaxMessageId`)
                
                if(result.success)
                {
                    this.serverMaxMessageId = result.data.Result
                } 
                console.log(`--- >>> getMaxMessageId From Server: ${this.serverMaxMessageId}`)

            }
            catch (err){ useToastStore().showError(err.message) }
        },
        async saveMessage ()
        {
            try 
            {
                console.log(`--- >>> Save Message To Server`)
                
                const result = await apiPost(`/messages/saveMessage`, this.message)
                
                if(result.success) 
                {
                    this.message            = result.data.Result 
                    this.clientMaxMessageId = this.message.MessageId
                    this.serverMaxMessageId = this.message.MessageId
                }
                else
                {
                    useToastStore().showError('Not able to save your Message to the server.')
                }

                return this.message
            }
            catch (err){ useToastStore().showError(err.message) }
        },
    }
})
