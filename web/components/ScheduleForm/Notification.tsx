import {useEffect, useRef, useState} from "preact/hooks"
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import {NotificationPayloadType, NotificationPayload} from "../../types.ts";
import type {ZodIssue} from "zod";

type NotificationFormProps = NotificationPayloadType & {
    onChange?: (type: string, payload: NotificationPayloadType) => void;
    active: boolean;
}

export function NotificationForm(props: NotificationFormProps) {
    const form = useRef<HTMLFormElement>(null)
    const [validateIssues, setValidateIssues] = useState<Record<string, ZodIssue> | null>(null)

    const handleSubmit = (force = false) => {
        const data: NotificationPayloadType = Object.fromEntries(new FormData(form.current!).entries()) as unknown as NotificationPayloadType;
        const result = NotificationPayload.safeParse(data)
        const issues = result.success ? [] : result.error.issues
        if (force || validateIssues) {
            setValidateIssues(Object.fromEntries(issues.map(issue => [issue.path.join('.'), issue])))
            props?.onChange?.(
                issues.length ? 'error' : 'success',
                data,
            )
        }
    };

    const prevActive = useRef(false)

    useEffect(() => {
        const prev = prevActive.current;
        prevActive.current = props.active;
        if (prev && !props.active) {
            handleSubmit(true);
        }
    }, [props.active]);

    return (
        <Box
            ref={form}
            component="form"
            sx={{display: 'flex', flexDirection: 'column', gap: 3}}
        >
            <FormControl>
                <FormLabel htmlFor="title" required>标题</FormLabel>
                <TextField
                    autoComplete="off"
                    name="title"
                    required
                    fullWidth
                    id="title"
                    placeholder="请输入通知标题"
                    error={!!validateIssues?.['title']}
                    helperText={validateIssues?.['title']?.message}
                    color={!!validateIssues?.['title'] ? 'error' : 'primary'}
                    onChange={() => handleSubmit()}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="body" required>内容</FormLabel>
                <TextField
                    autoComplete="off"
                    name="body"
                    required
                    fullWidth
                    id="body"
                    placeholder="请输入通知内容"
                    error={!!validateIssues?.['body']}
                    helperText={validateIssues?.['body']?.message}
                    color={!!validateIssues?.['body'] ? 'error' : 'primary'}
                    onChange={() => handleSubmit()}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="icon">推送图标</FormLabel>
                <TextField
                    autoComplete="icon"
                    name="icon"
                    fullWidth
                    id="icon"
                    placeholder="自定义推送图标"
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="sound">推送铃声</FormLabel>
                <TextField
                    autoComplete="sound"
                    name="sound"
                    fullWidth
                    id="sound"
                    placeholder="自定义推送铃声"
                />
            </FormControl>
        </Box>
    )
}