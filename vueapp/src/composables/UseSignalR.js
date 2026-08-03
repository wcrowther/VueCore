import * as signalR from '@microsoft/signalr'

let hubConnection   = null // Singleton instance
let usageCount      = 0 // tracks how many components are using the connection

export function useSignalR() 
{
    const isConnectedRef        = ref(false)
    const connectionStateRef    = ref('Disconnected')

    if (!hubConnection) 
    {
        hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${envConsts.baseApiUrl}/chathub`)
            .withAutomaticReconnect()
            .build();

        hubConnection.onclose(() => {
            isConnectedRef.value = false;
            connectionStateRef.value = 'Disconnected'
        });

        hubConnection.onreconnected(() => {
            isConnectedRef.value = true;
            connectionStateRef.value = 'Connected'
        });

        hubConnection.onreconnecting(() => {
            isConnectedRef.value = false;
            connectionStateRef.value = 'Reconnecting'
        });
    }

    async function startConnection() 
    {
        usageCount++

        if (hubConnection.state === signalR.HubConnectionState.Disconnected) 
        {
            try 
            {
                await hubConnection.start()
                isConnectedRef.value = true
                connectionStateRef.value = hubConnection.state
                console.log('SignalR connected', usageCount)
            } 
            catch (err) 
            {
                console.error('SignalR failed to connect:', err)
            }
        }
    }

    async function stopConnection() 
    {
        usageCount--
        console.log('SignalR disconnected A',usageCount)


        if (usageCount <= 0) 
        {
            usageCount = 0
            if ( hubConnection &&
                 hubConnection.state !== signalR.HubConnectionState.Disconnected ) 
            {
                await hubConnection.stop()
                isConnectedRef.value = false
                connectionStateRef.value = 'Disconnected'
                console.log('SignalR disconnected B')
            }
        }
    }

    function registerEvent(eventName, callback) 
    {
        hubConnection.on(eventName, callback)
    }

    function unregisterEvent(eventName) 
    {
        hubConnection.off(eventName)
    }

    function sendMessage(methodName, ...args) 
    {
        return hubConnection.send(methodName, ...args)
    }

    return {
        hubConnection,
        isConnectedRef,
        connectionStateRef,
        usageCount,
        startConnection,
        stopConnection,
        registerEvent,
        unregisterEvent,
        sendMessage,
    }
}
