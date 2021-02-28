import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
  Divider,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Navbar, Footer } from "../../../layouts";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

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

function FindDonors(props) {
  const classes = useStyles();
  const { donorsList, setDonors, active } = props.location;
  const loggedInState = useSelector((state) => state.loggedIn);

  const handleClick = (idx) => {
    if (window.confirm("Are you sure ?")) {
      axios
        .put(
          "http://localhost:8080/donationrequests/donationdonorverification",
          {
            donationId: active[idx].donationId,
            userId: donorsList[idx].userId,
          },
          {
            headers: {
              Authorization: "Bearer " + loggedInState.userToken,
            },
          }
        )
        .then((response) => {
          console.log(response);
          var updatedList = [...donorsList];
          updatedList[idx].donationStatus = true;
          setDonors(updatedList);
        });
    }
  };

  return (
    <>
      <Navbar />
      <Paper square elevation={5} className={classes.paper}>
        <Typography variant="h4">Invitees List</Typography>
        <Divider />
        <Typography variant="h6">
          list of the Invitees of the selected Request
        </Typography>
      </Paper>
      <Container maxWidth="lg">
        <Grid container justify="center" className={classes.table}>
          <Grid item xs={12}>
            <TableContainer component={Paper} className={classes.root}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Donor Id</TableCell>
                    <TableCell align="center">Donor Name</TableCell>
                    <TableCell align="center">Blood Group</TableCell>
                    <TableCell align="center">Donation Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {donorsList.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell align="center">{row.userId}</TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.bloodGroup}</TableCell>
                      <TableCell align="center">
                        <Button
                          disabled={donorsList[idx].donationStatus}
                          variant="contained"
                          color="secondary"
                          onClick={(e) => handleClick(idx)}
                        >
                          Given ?
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default FindDonors;