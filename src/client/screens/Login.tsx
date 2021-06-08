import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Link, CircularProgress } from '@material-ui/core';
import { Formik, Field, Form } from 'formik';
import InputField from '../components/inputField';
import { loginSchema } from '../../shared/helpers/validators';
import Home from './Home';
import { useAuth } from '../actions/authContext';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { LoginSchema } from '../../shared/models';

const Login = () => {
  const auth = useAuth()
  const loginDetails = {
    email: '',
    password: '',
  };

  const LoginForm = () => (
    <Formik
      initialValues={loginDetails}
      validationSchema={loginSchema}
      onSubmit={(values) => auth.loginUser(values)}
    >
      {(props) => (
        <Form
          style={{
            flexDirection: 'column',
            display: 'flex',
          }}
        >
          <Field data-testid="email" name="email" label="Email" component={InputField}></Field>
          <Field
            data-testid="password"
            name="password"
            label="Password"
            component={InputField}
            type="password"
          ></Field>
          <Button
            data-testid="loginButton"
            onClick={() => props.handleSubmit}
            type="submit"
            variant="contained"
            style={{ padding: '20px 0px 20px 0px' }}
            color="primary"
          >
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );

  if(auth.user) {
    return <Redirect to="/home" />
  }

  return (
    <div>
      <Container
        maxWidth="sm"
        style={{
          flexDirection: 'column',
          display: 'flex',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h2" gutterBottom color="primary">
          Login
        </Typography>
        <LoginForm />
        <Link href="/signup" color="secondary">
          <Typography
            style={{ marginTop: 10, textAlign: 'right' }}
            color="secondary"
            gutterBottom
          >
            Don't have an account? Sign Up
          </Typography>
        </Link>
        <div id="errMsg">
            {auth.error ? (
            <Typography color="error" style={{fontWeight: 800, marginTop: 30}}>
              🔐 {auth.error.msg}
            </Typography>
            ): (<></>)}
          </div>
      </Container>
    </div>
  );
};

export default Login;
