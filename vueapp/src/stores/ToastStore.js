
import { useToast, POSITION, TYPE } from "vue-toastification";

const toast = useToast();

export const useToastStore = defineStore('ToastStore',
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
        showMessage (message, duration, hidebar) { this.showToast(message, 'DEFAULT', duration || this.messageDuration, hidebar) },
        showSuccess (message, duration, hidebar) { this.showToast(message, 'SUCCESS', duration || this.messageDuration, hidebar) },
        showInfo    (message, duration, hidebar) { this.showToast(message, 'INFO',    duration || this.messageDuration, hidebar) },
        showWarning (message, duration, hidebar) { this.showToast(message, 'WARNING', duration || this.messageDuration, hidebar) },
        showError   (message, duration, hidebar) { this.showToast(message, 'ERROR',   duration || this.errorDuration,   hidebar) },

        showToast(message, type, duration, hidebar = true) 
        {
            if(message?.trim().length === 0)
            {
               console.log(`Toast '${type}' message was empty.`)  
               return      
            }
            
            if(['DEFAULT', 'SUCCESS', 'INFO', 'WARNING', 'ERROR'].indexOf(type) === 0)
                type = TYPE.DEFAULT
        
            if(!IsDuplicateMessage(message, this))
            {
                toast(message, 
                {
                    type:            type.toLowerCase(),
                    position:        POSITION.TOP_CENTER,
                    timeout:         duration || this.errorDuration,
                    hideProgressBar: hidebar,
                    transition:      "Vue-Toastification__slideBlurred"
                })
            }

            this.lastMessage  = message
            this.lastDateTime = new Date()
            
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