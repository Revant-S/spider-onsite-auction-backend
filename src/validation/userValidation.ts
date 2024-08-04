import { z } from "zod";


export const userSchema = z.object({
    userName: z.string().min(5).max(255).optional(),
    password: z.string().min(6).max(255),
    email: z.string().email()
})

export const valiadteUserBody = (userBody: z.infer<typeof userSchema>): z.SafeParseReturnType<z.infer<typeof userSchema>, z.infer<typeof userSchema>> => {
    return userSchema.safeParse(userBody);
}
