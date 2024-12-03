import {z} from "zod";

export const NotificationPayload = z.object({
    title: z.string(),
    body: z.string(),
    icon: z.string().optional(),
    sound: z.string().optional(),
    category: z.string().optional(),
    call: z.boolean().optional(),
    archive: z.boolean().optional(),
    level: z.enum(["critical", "passive", "active", "time-sensitive"]).optional(),
    url: z.string().optional(),
    copy: z.string().optional(),
    badge: z.number().optional(),
    autoCopy: z.boolean().optional(),
});

export type NotificationPayloadType = z.infer<typeof NotificationPayload>;
