import React from "react";
import Navbar from "../../../component/navbar";
import Footer from "../../../component/footer";
import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
  Button,
  Divider,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import api from "../../../Apis/api";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  paper: {
    width: "100%",
    flexDirection: "column",
    height: "auto",
    margin: "auto",
    padding: theme.spacing(2),
  },

  typo: {
    padding: "10px",
  },
  note: {
    fontWeight: "bold",
    color: "#e94364",
    marginTop: "20px",
  },
  table: {
    margin: theme.spacing(10),
    width: "80%",
  },
  button: {
    backgroundColor: "#e94364",
    color: "white",
    marginTop: "20px",
  },
}));

// function Product({ iota }) {
const Product = (props) => {
  const {
    bg,
    bbName,
    component,
    price,
    units,
    bbId,
    location,
    reason,
  } = props.location;
  const history = useHistory();
  const loggedInState = useSelector((state) => state.loggedIn);

  // state for are you sure dialog
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClosed = () => {
    setOpen(false);
  };

  // state for confirmation dialog
  const [open2, setOpen2] = React.useState(false);

  const handleClosed2 = () => {
    setOpen2(false);
    history.push("/home");
  };

  const handleSubmit = () => {
    setOpen(false);
    setIndicatorOpen(true);

    api
      .post()
      .confirmTransaction(
        {
          sellerId: bbId,
          bloodGroup: bg,
          component: component,
          units: units,
          location: location,
          reason: reason,
        },
        {
          headers: {
            Authorization: "Bearer " + loggedInState.userToken,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setIndicatorOpen(false);
          setOpen2(true);
        }
      })
      .catch();
  };

  const [indicatorOpen, setIndicatorOpen] = React.useState(false);

  const classes = useStyles();
  return (
    <>
      <Navbar />
      <Paper square elevation={5} className={classes.paper}>
        <Typography variant="h4">Selected Product</Typography>
        <Typography variant="h6">
          Details about the selected product, press Buy button to confirm your
          order
        </Typography>
      </Paper>
      <Container maxWidth="lg">
        <Grid
          container
          alignContent="center"
          justify="center"
          className={classes.table}
        >
          <Paper align="center" style={{ padding: "20px" }}>
            <Typography className={classes.typo} variant="h4">
              Confirm your Purchase
            </Typography>
            <Divider />
            <Container className={classes.typo}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography className={classes.typo} variant="h6">
                    Seller name :
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.typo} variant="h6">
                    {bbName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.typo} variant="h6">
                    Blood Group selected :
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.typo} variant="h6">
                    {bg}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.typo} variant="h6">
                    Component selected
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.typo} variant="h6">
                    {component}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.typo} variant="h6">
                    Units booked :
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.typo} variant="h6">
                    {units}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.typo} variant="h6">
                    Total amount to be paid :
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.typo} variant="h6">
                    {price * units}
                  </Typography>
                </Grid>
              </Grid>

              {/* Are you sure dialog */}
              <Dialog open={open} onClose={handleClosed}>
                <DialogTitle>{"Are You Sure?"}</DialogTitle>
                <DialogActions>
                  <Button onClick={handleClosed}>No</Button>
                  <Button onClick={handleSubmit}>Yes</Button>
                </DialogActions>
              </Dialog>

              {/* confirmation box */}
              <Dialog open={open2} onClose={handleClosed2}>
                <DialogTitle>
                  {
                    "Transaction successful. Check 'My Purchases' section for more info about the transaction"
                  }
                </DialogTitle>
                <DialogActions>
                  <Button onClick={handleClosed2}>Ok</Button>
                </DialogActions>
              </Dialog>

              {/* indicator for please wait */}
              <Backdrop className={classes.backdrop} open={indicatorOpen}>
                <CircularProgress
                  style={{ color: "#E94364", marginRight: "10px" }}
                />
                <Typography variant="h5">Please wait</Typography>
              </Backdrop>
            </Container>
            <Divider />

            <Typography className={classes.note} variant="body2">
              Important note : Booked blood must be collected within 24 hrs
            </Typography>

            <Button
              className={classes.button}
              type="button"
              onClick={handleClickOpen}
              variant="contained"
            >
              Proceed to buy
            </Button>
          </Paper>
        </Grid>
      </Container>

      <Footer />
    </>
  );
};

export default Product;