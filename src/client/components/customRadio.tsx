import React from 'react';
import { RadioGroup, Radio, FormControlLabel} from '@material-ui/core';
import { FieldProps } from 'formik';

export const GenderRadio = ({
  field: { name, value, onBlur, onChange },
  form: { touched, errors, setFieldTouched },
  ...props
}: FieldProps) => {
  return (
    <RadioGroup aria-label="gender" name="gender1" value={value} onChange={(data) => onChange(name)(data)}>
    <FormControlLabel data-testid="female-radio" value="female" control={<Radio />} label="Female" />
    <FormControlLabel data-testid="male-radio" value="male" control={<Radio />} label="Male" />
  </RadioGroup>
  )
}