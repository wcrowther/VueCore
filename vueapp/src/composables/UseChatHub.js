import { useSignalR } from '@/composables/UseSignalR'

export function useChatHub() 
{
    const authStore	                                    = useAuthStore()
    const { userId: currentUserId }                     = storeToRefs(authStore) 

    const messageStore                                  = useMessagesStore()
    const { message, messages, messagesCount,
            clientMaxMessageId, serverMaxMessageId }    = storeToRefs(messageStore) 
    const { addNewMessage, getAllMessages, 
            saveMessage, getMaxMessageId }              = messageStore

    const { isConnectedRef, startConnection,
            registerEvent }                             = useSignalR()

    onMounted(async ()   => await startConnection())
    //onUnmounted(async () => await stopConnection()) stopConnection, 
    
    // Activate ChatRoom component
    const startChat = async () => 
    {
        try 
        {
            addNewMessage(currentUserId, '')

            await getAllMessages()  // get messages from server

            registerEvent('ReceiveMessage', message => 
            {
                let alreadyInList = messages.value.some(msg => msg.MessageId === message.MessageId)
                if (!alreadyInList)
                {
                    messages.value.push(message)
                    clientMaxMessageId.value = message.MessageId
                    serverMaxMessageId.value = message.MessageId
                }
            })

            console.log('SignalR startChat connected')
        } 
        catch (error) 
        {
            console.error('SignalR startChat connection failed:', error)
        }
    }

    // Activate NewChatMessages component
    const monitorChat = async () => 
    {
        try 
        {
            await getMaxMessageId() // set maxMessageIds
            clientMaxMessageId.value = serverMaxMessageId.value // initialize start id
            
            registerEvent('ReceiveMaxMessageId', serverMaxId => 
            {
                serverMaxMessageId.value = serverMaxId
            })

            console.log('SignalR monitorChat connected')
        } 
        catch (error) 
        {
            console.error('SignalR monitorChat connection failed:', error)
        }
    }

    const sendMessage = async () => 
    {
        var messageSaved = await saveMessage(message.value)

        console.log('ChatHub.sendMessage()', messageSaved.CreatorId, messageSaved.MessageText)

        message.value = addNewMessage(currentUserId, '')  // reset message
    }

    // onUnmounted(() =>  { connection.stop() })

    return {
        isConnectedRef,
        sendMessage,
        startChat,
        monitorChat,
        message,
        messages, 
        messagesCount,
        clientMaxMessageId, 
        serverMaxMessageId
    }
}



// ====================================================================
// Alt version calling ChatHub.SendMessage using this code. Currently we 
// are calling to all the chathubs on the server in c# MessageEndpoints
// ====================================================================
// if(!messageSaved)
// {
//     console.error('Not able to save message.')
//     return
// }
// await connection.invoke('SendMessage', messageSaved)
// ====================================================================
