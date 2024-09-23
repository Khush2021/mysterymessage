import {z} from "zod";
export const messageSchema = z.object({
    content : z.string().min(3, "content must be atleast 3 characters")
                        .max(300, "content can be atmost 300 characters")
})