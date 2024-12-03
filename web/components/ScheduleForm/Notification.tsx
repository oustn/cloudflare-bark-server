import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

export function NotificationForm() {
    const handleSubmit = () => {
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{display: 'flex', flexDirection: 'column', gap: 2}}
        >
            <FormControl>
                <FormLabel htmlFor="title" required>标题</FormLabel>
                <TextField
                    autoComplete="title"
                    name="title"
                    required
                    fullWidth
                    id="title"
                    placeholder="请输入通知标题"
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="body" required>内容</FormLabel>
                <TextField
                    autoComplete="body"
                    name="body"
                    required
                    fullWidth
                    id="body"
                    multiline
                    rows={2}
                    placeholder="请输入通知内容"
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