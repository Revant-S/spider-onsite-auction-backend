import { string, z } from "zod"


export const toastMessage = z.object({
    toastRequired : z.boolean(),
    toastInfo : z.object({
        message : z.string()
    }),
    svg : z.string()
})

export interface ToastMessage extends z.infer<typeof toastMessage>{}