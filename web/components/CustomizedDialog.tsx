import * as React from 'react';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiPaper-root': {
        margin: theme.spacing(2),
        maxWidth: 600,
        width: `calc(100% - ${theme.spacing(4)})`,
    },
    '& .MuiDialogContent-root': {
        padding: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '60vh'
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(2),
    },
}));

const ActionButton = styled(Button)(({theme}) => ({
    paddingBlock: theme.spacing(0.5),
    paddingInline: theme.spacing(4),
}))

export interface CustomizedDialogActions {
    handleClose: () => void;
    handleOpen: () => void;
}

interface CustomizedDialogProps {
    children?: React.ReactNode;

    reference?: React.ReactNode | {
        (actions: CustomizedDialogActions): React.ReactNode
    }

    title?: React.ReactNode | String

    showFooter?: boolean
}

export function CustomizedDialog(props: CustomizedDialogProps) {
    const {children, reference, title, showFooter = true} = props
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (_e?: unknown, reason?: string) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
        setOpen(false);
    };

    return (
        <React.Fragment>
            {
                typeof reference === 'function' ? reference({
                    handleClose,
                    handleOpen: handleClickOpen
                }) : reference
            }
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                {
                    title && (
                        <DialogTitle sx={{m: 0, p: 2}}
                                     id="customized-dialog-title">
                            {title}
                        </DialogTitle>
                    )
                }
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent>
                    {children}
                </DialogContent>
                {
                    showFooter && (
                        <DialogActions>
                            <ActionButton onClick={handleClose}>
                                取消
                            </ActionButton>
                            <ActionButton variant="contained" onClick={handleClose}>
                                保存
                            </ActionButton>
                        </DialogActions>
                    )
                }
            </BootstrapDialog>
        </React.Fragment>
    );
}