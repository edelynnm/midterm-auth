import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useAuth } from '../actions/authContext';
import Home from '../screens/Home';
import Login from '../screens/Login';
import SignUp from '../screens/Signup';
import { Typography, Link, CircularProgress } from '@material-ui/core';

const NotFound = () => {
  return (
    <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <Typography variant='h5'>Page not found!</Typography>
      <Link href="/" color="primary">
          <Typography
            style={{ marginTop: 10, textAlign: 'right' }}
            color="primary"
          >
            Return
          </Typography>
        </Link>
    </div>
  )
}

const AppRouter = () => {
  const auth = useAuth()

  const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={(props) => 
          auth.user ? <Component {...props} /> : <Redirect to={{pathname: "/" }} />
        }
      />
    );
  }

  if(auth.loading) {
    return (
      <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100vh'}}>
        <CircularProgress />
      </div>
    )
  }
  
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/home" component={Home} />
        <Route exact path="/" component={Login}/>
        <Route exact path="/signup" component={SignUp}/>
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default AppRouter;