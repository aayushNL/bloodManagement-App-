import {
  Grid,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import hospital from "./images/hospital.jpg";
import states from "./states.json";
import Joi from "joi";
import LoggedOutNavbar from "../layouts/loggedoutNavbar";
import axios from "axios";
import logging from "../../redux/Actions/login";

import { useSelector, useDispatch } from "react-redux";
import registerHospital from "../../redux/Actions/registerHospital";

function BloodBankRegistration(props) {
  const [data, setData] = useState({
    name: "",
    email: "",
    license: "",
    phone: [""],
    address: "",
    state: "",
    district: "",
    pincode: "",
    password: "",
    cPassword: "",
    terms: false,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const history = useHistory();
  const [errors, setErrors] = useState({});

  const [maxLimit, setMaxLimit] = useState("Add a phone number");
  const [enable, setEnable] = useState(true);
  const [selectedStateIndex, setSelectedStateIndex] = useState(0);

  const paperStyle = {
    height: "auto",
    width: "450px",
    display: "flex",
    flexDirection: "column",
    padding: "30px",
  };

  const margin = { marginTop: "15px" };

  const validateProperty = ({ name, value }) => {
    const inputField = { [name]: value };
    const fieldSchema = Joi.object({ [name]: schema[name] });
    const { error } = fieldSchema.validate(inputField);
    return error ? error.details[0].message : null;
  };

  const validate = () => {
    const formSchema = Joi.object(schema);
    const { error } = formSchema.validate(data, {
      abortEarly: false,
    });

    if (!error) return null;

    const allErrors = {};
    for (let err of error.details) {
      allErrors[err.path[0]] = err.message;
    }
    return allErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setEnable(false);
      setSelectedStateIndex(
        states.states.findIndex((item) => item.state === value)
      );
    }

    const allErrors = { ...errors };
    const errorMsg = validateProperty(e.target);
    if (errorMsg) {
      allErrors[name] = errorMsg;
    } else {
      delete allErrors[name];
    }
    const updatedData = { ...data };
    updatedData[name] = value;
    setData(updatedData);
    setErrors(allErrors);
  };

  const handleTermsCheck = (e) => {
    const updatedData = { ...data };
    updatedData[e.target.name] = e.target.checked;
    const allErrors = { ...errors };
    setData(updatedData);
    setErrors(allErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();

    setErrors({ errors: errors || {} });
    if (errors) return;

    axios
      .post("http://localhost:5000/login", {
        email: data.email,
        password: data.password,
      })
      .then(function (response) {
        if (response.data.success) {
          dispatch(
            logging({ isLoggedIn: true, userType: props.location.type })
          );
          history.push("/home");
        } else {
          console.log(response.data.error);
          if (response.data.error.includes("email")) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: response.data.error,
            }));
          } else if (response.data.error.includes("password")) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              password: response.data.error,
            }));
          }
        }
      })
      .catch(function (error) {
        window.alert(error.message);
      });
  };

  const schema = {
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "in"] },
      })
      .required(),
    license: Joi.string().required(),
    phone: Joi.array().items(Joi.number().min(10).required()).max(5),
    address: Joi.string().required(),
    state: Joi.string().required(),
    district: Joi.string().required(),
    pincode: Joi.number()
      .positive()
      .min(6)
      .message("Pincode must contain 6 digits")
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .message("Enter a stronger password")
      .required(),
    cPassword: Joi.ref("password"),
    terms: Joi.boolean().required().invalid(false),
  };

  const handleNumberChange = (e, id) => {
    const allErrors = { ...errors };
    const errorMsg = validatePhone(e.target);
    if (errorMsg) {
      errors[e.target.name] = errorMsg;
    } else {
      delete errors[e.target.name];
    }

    const updatedData = { ...data };
    updatedData.phone[id] = e.target.value;
    setData(updatedData);
    setErrors(allErrors);
  };

  const validatePhone = ({ name, value }) => {
    const phone = { [name]: value };
    const phoneSchema = Joi.object({
      [name]: Joi.number().min(10).label("Phone Number"),
    });
    const { error } = phoneSchema.validate(phone);
    return error ? error.details[0].message : null;
  };

  const handleAdd = () => {
    if (data.phone.length < 5) {
      setData((prevState) => ({
        ...prevState,
        phone: [...prevState.phone, ""],
      }));
    } else {
      setMaxLimit("Maximum limit reached");
    }
  };

  return (
    <>
      <LoggedOutNavbar />

      <Grid container style={{ margin: "20px auto" }}>
        <Grid item xs={6} container justify="center" alignItems="center">
          <img src={hospital} alt="hospital" style={{ maxWidth: "100%" }} />
        </Grid>

        <Grid item xs={6} container justify="center" alignItems="center">
          <form>
            <Paper style={paperStyle} elevation={5}>
              <h2 style={{ marginTop: "10px" }} align="center">
                Hospital Registration
              </h2>

              <TextField
                label="Name"
                placeholder="Enter your full name"
                type="text"
                fullWidth
                style={margin}
                name="name"
                value={data.name}
                onChange={handleChange}
                inputProps={{
                  maxLength: 30,
                }}
                error={errors && errors.name ? true : false}
                helperText={errors && errors.name ? errors.name : null}
              />

              <TextField
                label="Email"
                placeholder="Enter your email"
                type="email"
                fullWidth
                style={margin}
                name="email"
                value={data.email}
                onChange={handleChange}
                error={errors && errors.email ? true : false}
                helperText={errors && errors.email ? errors.email : null}
              />

              <TextField
                label="License Number"
                placeholder="Enter your license number"
                type="text"
                fullWidth
                style={margin}
                name="license"
                value={data.license}
                onChange={handleChange}
                error={errors && errors.license ? true : false}
                helperText={errors && errors.license ? errors.license : null}
              />

              {data.phone.map((val, idx) => (
                <TextField
                  label={`Phone-${idx + 1}`}
                  placeholder="Enter your phone number"
                  type="text"
                  fullWidth
                  style={margin}
                  name={`phone${idx}`}
                  value={val}
                  onChange={(e) => {
                    handleNumberChange(e, idx);
                  }}
                  key={idx}
                  inputProps={{
                    maxLength: 10,
                  }}
                  error={errors && errors[`phone${idx}`] ? true : false}
                  helperText={
                    errors && errors[`phone${idx}`]
                      ? errors[`phone${idx}`]
                      : null
                  }
                />
              ))}
              <Button onClick={handleAdd}>{maxLimit}</Button>

              <TextField
                label="Registered Address"
                placeholder="Enter your registered address"
                type="text"
                fullWidth
                style={margin}
                name="address"
                value={data.address}
                onChange={handleChange}
                error={errors && errors.address ? true : false}
                helperText={errors && errors.address ? errors.address : null}
              />

              <FormControl style={margin}>
                <InputLabel>State</InputLabel>
                <Select name="state" onChange={handleChange} value={data.state}>
                  {states.states.map((item, id) => (
                    <MenuItem value={item.state} key={id}>
                      {item.state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl style={margin}>
                <InputLabel>District</InputLabel>
                <Select
                  inputProps={{ readOnly: enable }}
                  name="district"
                  onChange={handleChange}
                  value={data.district}
                >
                  {states.states[selectedStateIndex].districts.map(
                    (item, id) => (
                      <MenuItem value={item} key={id}>
                        {item}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              <TextField
                label="Pincode"
                placeholder="Enter your pincode"
                type="text"
                fullWidth
                style={margin}
                name="pincode"
                value={data.pincode}
                onChange={handleChange}
                inputProps={{
                  maxLength: 6,
                }}
                error={errors && errors.pincode ? true : false}
                helperText={errors && errors.pincode ? errors.pincode : null}
              />

              <TextField
                label="Password"
                placeholder="Create your password"
                type="password"
                fullWidth
                style={margin}
                name="password"
                value={data.password}
                onChange={handleChange}
                inputProps={{
                  maxLength: 30,
                }}
                error={errors && errors.password ? true : false}
                helperText={errors && errors.password ? errors.password : null}
              />

              <TextField
                label="Confirm Password"
                placeholder="Confirm your password"
                type="password"
                fullWidth
                style={margin}
                name="cPassword"
                value={data.cPassword}
                onChange={handleChange}
                inputProps={{
                  maxLength: 30,
                }}
                error={data.password !== data.cPassword ? true : false}
                helperText={
                  data.password !== data.cPassword
                    ? "passwords do not match"
                    : null
                }
              />

              <FormControlLabel
                style={margin}
                control={
                  <Checkbox
                    onChange={handleTermsCheck}
                    inputProps={{ required: true }}
                    name="terms"
                  />
                }
                label="Accept Terms and Conditions"
              />
              <Link
                to="/terms"
                style={{ color: "#E94364", fontWeight: "bold" }}
              >
                (Click here for terms and condition)
              </Link>

              <Button
                variant="contained"
                style={{
                  backgroundColor: "#E94364",
                  marginTop: "20px",
                  // color: "white",
                }}
                type="submit"
                disabled={validate()}
                onClick={handleSubmit}
              >
                Sign Up
              </Button>

              <Typography align="center" style={margin}>
                <Link to="/Login">Already a user ? Sign in</Link>
              </Typography>
            </Paper>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default BloodBankRegistration;
