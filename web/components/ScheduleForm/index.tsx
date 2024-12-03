import * as React from 'react';

import MuiTab, {TabProps} from '@mui/material/Tab';
import {styled} from '@mui/material/styles';
import NavigateNext from '@mui/icons-material/NavigateNext'
import TabContext from '@mui/lab/TabContext';
import MuiTabList from '@mui/lab/TabList';
import MuiTabPanel from '@mui/lab/TabPanel';
import MuiBox from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import Button, {ButtonProps} from "@mui/material/Button";

import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import {NotificationForm} from "./Notification"
import {ScheduleForm} from "./Schedule"
import {createInitialSchedule, NotificationPayloadType, ScheduleType} from '../../types'

type StyledTabProps = TabProps & {
    label: string;
    isActive: boolean;
    navigator?: boolean;
    state: 'pending' | 'success' | 'error';
}

const TabList = styled(MuiTabList)(({theme}) => ({
    minHeight: 40,

    '& .MuiButtonBase-root': {
        paddingInline: theme.spacing(0.5),
        paddingBlock: theme.spacing(1),
        minHeight: 40,
        minWidth: 'auto',
    }
}));

const TabPanel = styled(MuiTabPanel)(({theme}) => ({
    paddingInline: theme.spacing(4),
    minHeight: 0,
    flex: 1,
    overflowY: 'auto',

    [theme.breakpoints.down('sm')]: {
        paddingInline: theme.spacing(2)
    }
}));

const Box = styled(MuiBox)(({theme}) => ({
    paddingInline: theme.spacing(4),

    [theme.breakpoints.down('sm')]: {
        paddingInline: theme.spacing(2)
    }
}));


const Tab = styled((props: StyledTabProps) => {
    let Icon = ScheduleIcon
    let color = 'disabled'

    const sx: Record<string, unknown> = {
        fontSize: props.navigator ? '1.5em' : '1.1em',
        marginLeft: '4px !important',
        top: '-1px'
    }

    if (props.navigator) {
        Icon = NavigateNext
    } else {
        if (props.state === 'pending') {
            sx['.MuiSvgIcon-root'] = {
                display: 'none'
            }
            if (props.isActive) {
                color = 'primary'
            }
            // @ts-ignore
        } else if (props.state === 'error') {
            color = 'warning'
            Icon = InfoOutlinedIcon
        } else if (props.state === 'success') {
            color = 'success'
            Icon = CheckCircleOutlinedIcon
        }
    }


    return (
        <MuiTab
            disableRipple
            {...props}
            iconPosition="end"
            icon={
                <Icon
                    className="relative"
                    color={color as 'action'}
                    sx={[
                        sx,
                        props.state === 'pending' && {
                            '& path:nth-of-type(2n)': {
                                display: 'none'
                            }
                        }
                    ]}
                />
            }
        />
    )
})({
    '&': {
        paddingInline: 0
    }
});

const ActionButton = styled((props: ButtonProps) => <Button
    fullWidth {...props}/>)()

export function NotificationScheduleForm() {
    const [value, setValue] = React.useState("1");

    const [notificationStatus, updateNotificationStatus] = React.useState('pending')
    const [scheduleStatus, updateScheduleStatus] = React.useState('')

    const handleChange = (_event: unknown, newValue: string) => {
        setValue(newValue);
        if (newValue === '1') {
            !notificationStatus && updateNotificationStatus('pending')
            return
        }
        if (newValue === '2') {
            !scheduleStatus && updateScheduleStatus('pending')
            return
        }
    };

    const [schedule, updateSchedule] = React.useState<ScheduleType>(createInitialSchedule())

    const handleNotificationChange = (type: string, payload: NotificationPayloadType) => {
        updateNotificationStatus(type)

        updateSchedule({
            ...schedule,
            payload,
        })
    }

    return (
        <MuiBox className="flex flex-col min-h-0 flex-auto">
            <TabContext value={value}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={handleChange}
                             aria-label="lab API tabs example">
                        <Tab label="通知配置" value="1" state={notificationStatus} isActive/>
                        <Tab disabled navigator/>
                        <Tab label="计划配置" value="2" state={scheduleStatus}/>
                        <Tab disabled navigator/>
                        <Tab label="测试" value="3"/>
                    </TabList>
                </Box>
                <TabPanel value="1" keepMounted>
                    <NotificationForm
                        {...schedule.payload}
                        active={value === '1'}
                        onChange={handleNotificationChange}
                    />
                </TabPanel>
                <TabPanel value="2" keepMounted>
                    <ScheduleForm { ...schedule }/>
                </TabPanel>
                <TabPanel value="3" keepMounted>测试</TabPanel>
            </TabContext>
            <Box sx={{borderTop: 1, borderColor: 'divider'}}>
                <DialogActions sx={{
                    paddingLeft: '0 !important',
                    paddingRight: '0 !important'
                }}>
                    <ActionButton variant="outlined">
                        取消
                    </ActionButton>
                    <ActionButton autoFocus variant="contained">
                        保存
                    </ActionButton>
                </DialogActions>
            </Box>
        </MuiBox>
    );
}
