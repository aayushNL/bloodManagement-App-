import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Grid, Paper, Typography, Divider, Button } from "@material-ui/core";

import LoggedOutNavbar from "../layouts/loggedoutNavbar";

function Options() {
  const paperStyle = {
    display: "flex",
    width: 380,
    flexDirection: "column",
    padding: "30px",
  };
  const margin = { marginTop: "20px" };

  const history = useHistory();

  const handleSet = (e, name) => {
    var type = "";
    if (name === "individual") {
      type = "0";
      history.push({ pathname: "/IndividualRegistration", type });
    } else if (name === "bloodbank") {
      type = "1";
      history.push({ pathname: "/BloodBankRegistration", type });
    } else {
      type = "2";
      history.push({ pathname: "/HospitalRegistration", type });
    }
  };

  return (
    <>
      <LoggedOutNavbar />

      <Grid
        container
        style={{ marginTop: "100px", backgroundColor: "#E94364" }}
      >
        <Grid item xs={12} container justify="center" alignItems="center">
          <Paper elevation={5} style={paperStyle}>
            <Grid align="center">
              <h2 style={{ marginTop: "15px" }}>Which type of user are you?</h2>
              <Typography style={margin}>
                <Button
                  onClick={(e) => {
                    handleSet(e, "individual");
                  }}
                >
                  Individual
                </Button>
              </Typography>
              <Typography style={margin}>
                <Button
                  onClick={(e) => {
                    handleSet(e, "bloodbank");
                  }}
                >
                  Blood-Bank
                </Button>
              </Typography>
              <Typography style={margin}>
                <Button
                  onClick={(e) => {
                    handleSet(e, "hospital");
                  }}
                >
                  Hospital
                </Button>
              </Typography>
              <Divider style={margin} />
              <Typography style={margin}>
                <p>
                  Existing user ? <Link to="/">Sign in</Link>
                </p>
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Options;