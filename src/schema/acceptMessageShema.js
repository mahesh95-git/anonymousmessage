import {z} from "zod"

export const messageSchema = z.object({
    isAcceptMessage:z
    .boolean()
    .default(false)
})