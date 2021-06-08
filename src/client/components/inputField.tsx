import React from 'react';
import { TextField } from '@material-ui/core';

const InputField = ({
  field: { name, value, onBlur, onChange },
  form: { touched, errors, setFieldTouched },
  ...props
}: any ) => {
  const hasErr = errors[name] && touched[name] ? true : false;

  return (
    <TextField
      {...props}
      variant="outlined"
      helperText={hasErr ? errors[name] : props.helperText}
      error={hasErr}
      value={value}
      onChange={(data) => onChange(name)(data)}
      onBlur={() => {
        setFieldTouched(name);
        onBlur(name);
      }}
      style={{ marginBottom: 20 }}
    ></TextField>
  );
};

export default InputField;
