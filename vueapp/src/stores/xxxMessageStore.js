
import { useToast, POSITION, TYPE } from "vue-toastification";

const toast = useToast();

export const useMessageStore = defineStore('MessageStore',
{
    state: () => 
    ({
        messageHistory:     [],   // Will add history
        messageDuration:    4000,
        errorDuration:      8000,
        duplicateThreshold: 3000, // 3 seconds
        lastMessage:        '',
        lastDateTime:       ''
    }),
    getters:{},
    actions:
    {
        showMessage(message, duration)      { this.showToast(message, 'DEFAULT', duration || this.messageDuration) },
        showSuccess(message, duration)      { this.showToast(message, 'SUCCESS', duration || this.messageDuration) },
        showInfo(message, duration)         { this.showToast(message, 'INFO',    duration || this.messageDuration) },
        showWarning(message, duration)      { this.showToast(message, 'WARNING', duration || this.messageDuration) },
        showError(message, duration)        { this.showToast(message, 'ERROR',   duration || this.errorDuration)   },
        showToast(message, type, duration) 
        {
            // console.log(message)
            
            if(['DEFAULT', 'SUCCESS', 'INFO', 'WARNING', 'ERROR'].indexOf(type) === 0)
                type = TYPE.DEFAULT
        
            if(!IsDuplicateMessage(message, this))
            {
                toast(message, 
                {
                    type: type.toLowerCase(),
                    position: POSITION.TOP_CENTER,
                    timeout: duration || this.errorDuration,
                    hideProgressBar: true,
                    transition: "Vue-Toastification__slideBlurred"
                })
            }

            this.lastMessage    = message
            this.lastDateTime   = new Date()
            
            console.log(`${type}: ${message}`)
        }
    }
})


// -------------------------------------------------------------
// * Vue Toastification *
// -------------------------------------------------------------
// https://vue-toastification.maronato.dev/
// npm install --save vue-toastification@next
// -------------------------------------------------------------