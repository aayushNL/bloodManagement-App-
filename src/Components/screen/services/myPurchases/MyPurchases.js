import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
  Divider,
} from "@material-ui/core";
import { Navbar, Footer } from "../../../layouts";
import axios from "axios";
import { useSelector } from "react-redux";

import Table from "./table";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",

    flexDirection: "column",
    margin: "auto",
    padding: theme.spacing(4),
  },
  table: {
    margin: theme.spacing(3),
  },
}));

function MyPurchase() {
  const [purchase, setList] = useState([]);
  const loggedInState = useSelector((state) => state.loggedIn);
  useEffect(() => {
    axios
      .get("http://localhost:8080/transactions/fetchpurchaseslist", {
        headers: {
          Authorization: "Bearer " + loggedInState.userToken,
        },
      })
      .then((response) => {
        // if (response.data.success) {
        console.log(response);
        setList(response.data);
        // }
      })
      .catch();
  }, []);

  const classes = useStyles();

  return (
    <>
      <Navbar />
      <Paper square elevation={5} className={classes.paper}>
        <Typography variant="h4">My Purchases</Typography>
        <Divider />
        <Typography variant="h6">
          Here you can view all the purchases you have done since your
          registration
        </Typography>
      </Paper>
      <Container maxWidth="xl">
        <Grid container justify="center" className={classes.table}>
          <Grid item xs={12}>
            <Table list={purchase} />
          </Grid>
        </Grid>
      </Container>
      <Container style={{ height:"90px" }}></Container>
      <Footer />
    </>
  );
}

export default MyPurchase;
