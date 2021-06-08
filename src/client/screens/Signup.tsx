import React from "react";
import { Formik, Field, Form, FieldProps } from "formik";
import InputField from "../components/inputField";
import { signUpSchema } from "../../shared/helpers/validators";
import {
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel,
  FormHelperText,
  Button,
  Container,
  Typography,
  Link,
} from "@material-ui/core";
import { Gender } from "../../shared/models";
import { useAuth } from "../actions/authContext";
import { Redirect } from "react-router-dom";

const GenderRadio = ({
  field: { name, value, onChange },
  form: { touched, errors },
  ...props
}: FieldProps) => {
  const hasErr = errors[name] && touched[name] ? true : false;

  return (
    <FormControl error={hasErr} {...props}>
      <FormLabel>Gender</FormLabel>
      <RadioGroup
        name="gender"
        value={value}
        onChange={(data) => onChange(name)(data)}
        style={{ display: "flex", flexDirection: "row" }}
      >
        <FormControlLabel
          data-testid="female"
          value={Gender.FEMALE}
          control={<Radio />}
          label="Female"
        />
        <FormControlLabel
          data-testid="male"
          value={Gender.MALE}
          control={<Radio />}
          label="Male"
        />
      </RadioGroup>
      <FormHelperText>{hasErr ? errors[name] : ""}</FormHelperText>
    </FormControl>
  );
};

const SignUp = () => {
  const signUpDetails = {
    email: "",
    password: "",
    fname: "",
    lname: "",
    gender: "",
  };
  const auth = useAuth();

  const SignUpForm = () => (
    <Formik
      initialValues={signUpDetails}
      validationSchema={signUpSchema}
      onSubmit={(values) => auth.signupUser(values)}
    >
      {(props) => (
        <Form
          style={{
            flexDirection: "column",
            display: "flex",
          }}
        >
          <Field
            data-testid="email"
            name="email"
            label="Email"
            component={InputField}
          ></Field>
          <Field
            data-testid="password"
            name="password"
            label="Password"
            component={InputField}
            type="password"
          ></Field>
          <Field
            data-testid="firstName"
            name="fname"
            label="First Name"
            component={InputField}
          ></Field>
          <Field
            data-testid="lastName"
            name="lname"
            label="Last Name"
            component={InputField}
          ></Field>
          <Field
            data-testid="gender"
            name="gender"
            type="radio"
            component={GenderRadio}
          ></Field>
          {auth.error ? (
            <Typography
              data-testid="email-exists"
              color="error"
              variant="button"
              style={{ textAlign: "center", fontWeight: 800 }}
            >
              {auth.error.msg}
            </Typography>
          ) : (
            <></>
          )}
          <Button
            data-testid="signupBtn"
            onClick={() => props.handleSubmit}
            type="submit"
            variant="contained"
            style={{ padding: "20px 100px 20px 100px", marginTop: 15 }}
            color="secondary"
          >
            Sign up
          </Button>
        </Form>
      )}
    </Formik>
  );

  if (auth.user) {
    return <Redirect to="/home" />;
  }

  return (
    <div>
      <Container
        maxWidth="sm"
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h2" gutterBottom color="secondary">
          Sign up
        </Typography>
        <SignUpForm />
        <Link href="/" color="primary">
          <Typography
            style={{ marginTop: 10, textAlign: "right" }}
            color="primary"
            gutterBottom
          >
            Already have an acccount? Login
          </Typography>
        </Link>
      </Container>
    </div>
  );
};

export default SignUp;
