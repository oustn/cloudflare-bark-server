import { useState } from "preact/hooks"
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import {ScheduleType, ScheduleTypeMap} from "./meta"
import {CustomSelect, CustomSelectChangeEvent } from "../CustomSelect"
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {styled} from "@mui/material/styles";

const SelectFormControl = styled(Box)(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}))

export function ScheduleForm() {
  const handleSubmit = () => {
  };

  const [type, updateType] = useState('')
  const [inArray, updateInArray] = useState<Array<string>>([])
  const [at, updateAt] = useState('')

  const handleTypeChange = (e: CustomSelectChangeEvent<string>) => {
    updateType((e.target.value))
  }

  const handleInArrayChange = (e: CustomSelectChangeEvent<string[]>) => {
    updateInArray(e.target.value)
  }

  const handleAtChange = (e: CustomSelectChangeEvent<string>) => {
    updateAt(e.target.value)
  }

  const isCustom = type === 'custom'

  const TypeMap = ScheduleTypeMap[type as keyof typeof ScheduleTypeMap] || { in: [], at: []}


  return (
          <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{display: 'flex', flexDirection: 'column', gap: 2}}
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
                      options={ScheduleType}
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
                      control={<Checkbox name="weekend" value="allowExtraEmails"
                                         color="primary"/>}
                      label="只在工作日触发"
              />
            </FormControl>
          </Box>
  )
}
