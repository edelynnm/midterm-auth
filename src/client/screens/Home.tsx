import React from "react";
import { Button, Container, Typography } from "@material-ui/core";
import { useAuth } from "../actions/authContext";

const Home = () => {
  const auth = useAuth();
  return (
    <Container
      data-testid="home"
      maxWidth="sm"
      style={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div>🔓</div>

      <Typography variant="h6" gutterBottom>
        Email: {auth.user?.email}
      </Typography>
      <Typography variant="h6" gutterBottom>
        First name: {auth.user?.fname}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Last name: {auth.user?.lname}
      </Typography>
      <Button
        onClick={() => auth.logoutUser()}
        variant="contained"
        style={{ padding: "20px 0px 20px 0px" }}
        color="primary"
      >
        Logout
      </Button>
    </Container>
  );
};

export default Home;
