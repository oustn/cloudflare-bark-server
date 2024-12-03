import {useState} from "preact/hooks"
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import {ScheduleTypes, ScheduleTypeMap} from "./meta"
import {CustomSelect, CustomSelectChangeEvent} from "../CustomSelect"
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {styled} from "@mui/material/styles";

import {ScheduleType, Schedule} from '../../types'

const SelectFormControl = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
    },
}))

type ScheduleProps = ScheduleType & {
    onChange?: (type: string, schedule: ScheduleType) => void;
    active: boolean;
}

export function ScheduleForm(props: ScheduleProps) {
    const handleSubmit = () => {
    };

    const [type, updateType] = useState(props.type)
    const [inArray, updateInArray] = useState<Array<string>>(props.in)
    const [at, updateAt] = useState(props.at)
    const [weekend, updateWeekend] = useState(props.weekend)

    const handleTypeChange = (e: CustomSelectChangeEvent<string>) => {
        updateType((e.target.value))
    }

    const handleInArrayChange = (e: CustomSelectChangeEvent<string[]>) => {
        updateInArray(e.target.value)
    }

    const handleAtChange = (e: CustomSelectChangeEvent<string>) => {
        updateAt(e.target.value)
    }

    const handleWeekendChange = (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        updateWeekend(!checked)
    }

    const isCustom = type === 'custom'

    const TypeMap = ScheduleTypeMap[type as keyof typeof ScheduleTypeMap] || {in: [], at: []}

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{display: 'flex', flexDirection: 'column', gap: 3}}
        >
            <Box sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                [theme.breakpoints.up('sm')]: {
                    flexDirection: 'row',
                },
            })}>
                <FormLabel id="type-label" htmlFor="type"
                           required>触发频率</FormLabel>
                <CustomSelect
                    fullWidth
                    name="type"
                    labelId="type-label"
                    id="type"
                    value={type}
                    placeholder="请选择触发频率"
                    options={ScheduleTypes}
                    onChange={handleTypeChange}
                />
            </Box>
            {
                !isCustom && (
                    <SelectFormControl>
                        <FormLabel id="inArray-label" htmlFor="inArray"
                                   required>触发时间</FormLabel>
                        <CustomSelect
                            value={inArray}
                            multiple
                            fullWidth
                            name="inArray"
                            labelId="inArray-label"
                            id="inArray"
                            placeholder="请选择触发的时间"
                            options={TypeMap.in}
                            onChange={handleInArrayChange}
                        />
                    </SelectFormControl>
                )
            }
            {
                !isCustom && (
                    <SelectFormControl>
                        <FormLabel id="inArray-label" htmlFor="inArray"
                                   required>触发时刻</FormLabel>
                        <CustomSelect
                            value={at}
                            fullWidth
                            name="inArray"
                            labelId="inArray-label"
                            id="inArray"
                            placeholder="请选择触发的时刻"
                            options={TypeMap.at}
                            onChange={handleAtChange}
                        />
                    </SelectFormControl>
                )
            }
            <FormControl>
                <FormLabel htmlFor="weekend"></FormLabel>
                <FormControlLabel
                    control={<Checkbox
                        value={!weekend}
                        name="weekend"
                        color="primary"
                        onChange={handleWeekendChange}
                    />}
                    label="只在工作日触发"
                />
            </FormControl>
        </Box>
    )
}
