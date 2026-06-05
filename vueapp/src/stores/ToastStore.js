
import { useToast, POSITION, TYPE } from "vue-toastification";

const toast = useToast();
const validToastTypes = ['DEFAULT', 'SUCCESS', 'INFO', 'WARNING', 'ERROR']

const ToastActionContent = defineComponent(
{
    name: 'ToastActionContent',
    props:
    {
        message:     { type: String, required: true },
        actionLabel: { type: String, default: 'Action' }
    },
    emits: ['action'],
    setup(props, { emit })
    {
        const invokeAction = (event) =>
        {
            event?.stopPropagation()
            emit('action')
        }

        return () => h('div', { class: 'toast-action-content' },
        [
            h('div', { class: 'toast-action-message' }, props.message),
            h('button',
            {
                type: 'button',
                class: 'toast-action-button',
                onClick: invokeAction
            }, props.actionLabel)
        ])
    }
})

function normalizeToastType(type)
{
    const normalized = String(type || TYPE.DEFAULT).toUpperCase()
    return validToastTypes.indexOf(normalized) === -1 ? TYPE.DEFAULT : normalized
}

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
        showAction  (message, actionLabel, onAction, duration, hidebar) 
                    { this.showActionToast(message, actionLabel, onAction, duration || this.messageDuration, hidebar) },

        showToast(message, type, duration, hidebar = true, extraOptions = {}) 
        {
            if(message?.trim().length === 0)
            {
               console.log(`Toast '${type}' message was empty.`)  
               return      
            }

            const normalizedType = normalizeToastType(type)
            const shouldSkipDuplicate = extraOptions.allowDuplicate === true

            if(shouldSkipDuplicate || !IsDuplicateMessage(message, this))
            {
                const toastContent = extraOptions.content || message
                let closeToastRef = null

                const contentWithClose = extraOptions.content?.listeners
                    ? {
                        ...extraOptions.content,
                        listeners: Object.keys(extraOptions.content.listeners).reduce((listeners, key) =>
                        {
                            const callback = extraOptions.content.listeners[key]
                            listeners[key] = async (...args) =>
                            {
                                await callback(...args, closeToastRef)
                            }
                            return listeners
                        }, {})
                    }
                    : toastContent

                const toastId = toast(contentWithClose, 
                {
                    type:            normalizedType.toLowerCase(),
                    position:        POSITION.TOP_CENTER,
                    timeout:         duration || this.errorDuration,
                    hideProgressBar: hidebar,
                    transition:      "Vue-Toastification__slideBlurred",
                    ...extraOptions.options
                })

                closeToastRef = () => toast.dismiss(toastId)
            }

            this.lastMessage  = message
            this.lastDateTime = new Date()
            
            console.log(`${normalizedType}: ${message}`)
        },

        showActionToast  (message, actionLabel, onAction, duration, hidebar = true)
        {
            this.showToast(message, 'WARNING', duration || this.messageDuration, hidebar,
            {
                allowDuplicate: true,
                content:
                {
                    component: ToastActionContent,
                    props:
                    {
                        message,
                        actionLabel: actionLabel || 'Stay Signed In'
                    },
                    listeners:
                    {
                        action: async (closeToast) =>
                        {
                            if (typeof onAction === 'function')
                                await onAction()

                            if (typeof closeToast === 'function')
                                closeToast()
                        }
                    }
                }
            })
        }
    }
})

/*
-------------------------------------------------------------
* Vue Toastification *
-------------------------------------------------------------
https://vue-toastification.maronato.dev/
npm install --save vue-toastification@next
-------------------------------------------------------------
*/