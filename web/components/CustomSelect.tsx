// @ts-nocheck
import {useState} from "preact/hooks"
import Select, { SelectProps} from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import MenuItem from '@mui/material/MenuItem';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

export type CustomSelectChangeEvent<Value = any> = Event & {
  target: {
    value: Value;
    name: string;
  }
}

type CustomSelectProps = Omit<SelectProps, 'onChange'> & {
  options: Array<{
    value: string;
    label: string;
    desc?: string;
  }>
  placeholder?: string;
  subSelect?: boolean;
  onChange?: (e: CustomSelectChangeEvent) => void;
}

export function CustomSelect(props: CustomSelectProps) {
  const {options, placeholder, multiple, subSelect, ...rest} = props
  const emptyString = options.find(d => d.value === '')

  const [innerValue, updateInnerValue] = useState<Array<unknown>>(multiple ? (Array.isArray(rest.value) ? [...rest.value] : []) : [])

  if (multiple) {
    const onInnerChange = (i: number, e: CustomSelectChangeEvent<unknown>) => {
      const newValue = [...innerValue]
      if (i < 0) {
        newValue.push((e.target as { value: unknown }).value)
      } else {
        newValue[i] = (e.target as { value: unknown }).value
      }
      updateInnerValue(newValue)
      rest.onChange?.({
        ...e,
        target: {
          ...e.target,
          value: newValue as unknown
        }
      } as CustomSelectChangeEvent)
    }

    const onInnerDelete = (i: number) => {
      const newValue = [...innerValue]
      newValue.splice(i, 1)
      updateInnerValue(newValue)
      rest.onChange?.({
        target: {
          value: newValue as unknown
        }
      } as CustomSelectChangeEvent)
    }

    return (
            <Box
                    sx={{
                      flex: 1
                    }}
            >
              <CustomSelect
                      {...rest}
                      value=""
                      options={options}
                      placeholder={placeholder}
                      onChange={(e) => onInnerChange(-1, e as CustomSelectChangeEvent)}
              />
              {
                innerValue.map((val, index) => (
                        <Box
                                className="flex flex-row"
                                key={index}
                                sx={{
                                  pl: 2,
                                  mt: 1,
                                  '& .MuiSelect-select': {
                                    paddingBlock: 0.8
                                  }
                                }}

                        >
                          <CustomSelect
                                  {...props}
                                  multiple={false}
                                  subSelect
                                  value={val}
                                  onChange={(e) => onInnerChange(index, e as CustomSelectChangeEvent)}
                                  sx={{
                                    ml: 2
                                  }}
                          />
                          <Button
                                  color="inherit"
                                  variant="outlined"
                                  startIcon={<CloseIcon/>}
                                  sx={{
                                    ml: 1,
                                    '&:hover': {
                                      opacity: '1'
                                    },
                                    '&': {
                                      opacity: '0.23',
                                      pl: 1,
                                      pr: 1,
                                      minWidth: 40,
                                    },
                                    '& .MuiButton-startIcon': {
                                      marginRight: 0,
                                      position: 'relative',
                                      left: 2,
                                    }
                                  }}
                                  onClick={() => onInnerDelete(index)}
                          />
                        </Box>
                ))
              }
            </Box>
    )
  }

  return (
          <Select
                  {...rest}
                  displayEmpty
                  MenuProps={{PaperProps: {sx: {maxHeight: 445}}}}
                  sx={{
                    '& .MuiTypography-caption': {
                      display: 'none'
                    },
                    '& .MuiRadio-root': {
                      display: 'none'
                    },
                    '& ._placeholder .MuiTypography-subtitle2': {
                      lineHeight: 1.5,
                      fontWeight: 'normal',
                      color: 'currentColor',
                      opacity: 'var(--mui-opacity-inputPlaceholder)'
                    }
                  }}
          >
            {
                    placeholder && (
                            <MenuItem className="hidden" value={undefined}
                                      key="__placeholder_undefined">
                              <Box className="_placeholder">
                                <Typography
                                        variant="subtitle2">{placeholder}</Typography>
                              </Box>
                            </MenuItem>
                    )
            }
            {
                    !emptyString && placeholder && (
                            <MenuItem className="hidden" value=""
                                      key="__placeholder_empty_string">
                              <Box className="_placeholder">
                                <Typography
                                        variant="subtitle2">{placeholder}</Typography>
                              </Box>
                            </MenuItem>
                    )
            }
            {
              options.map((type) => (
                      <MenuItem value={type.value} key={type.value}>
                        {
                          subSelect && <Radio checked={rest.value === type.value} size="small" sx={{ pl: 0, pr: 1 }}/>
                        }
                        <Box>
                          <Typography
                                  variant="subtitle2">{type.label}</Typography>
                          {
                                  type.desc && (
                                          <Typography variant="caption"
                                                      color="textDisabled">{type.desc}</Typography>
                                  )
                          }
                        </Box>
                      </MenuItem>
              ))
            }
          </Select>
  )
}