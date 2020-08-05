import "./LoginView.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import DetailIcon from '@material-ui/icons/Details';
import LocationOff from '@material-ui/icons/LocationOff';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { MapComponent } from '../components/MapComponent';

export function LoginView(props){
  const [ username, setUserName ] = useState("admin");
  const [ password, setPassword ] = useState("admin");

  function resetForm()
  {
    setUserName("");
    setPassword("");
  }
  
  // onload
  useEffect(()=>{

  },[])

  return(
      <div className="container-login">
      <div className="row"><br/><br/><br/><br/><br/><br/><br/><br/></div>
      <div className="row">
        <div className="col-md-6"/>
        <div className="col-md-1"/>
        <div className="col-md-5">
          <p className="textAlignCenter"></p>
          <div className="inputFieldWrapper" >
            <TextField label={"username"} value={username} fullWidth={true} onChange={(event)=>setUserName(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <TextField label={"password"} type="password" value={password} fullWidth={true} onChange={(event)=>setPassword(event.target.value)}/>
          </div>
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" value="login"
              onClick={() => {
                const obj = {'username': username, 'password': password};
                axios.post(`http://localhost:8080/login`, obj)
                .then(res => {
                    const response =  res.data;
                    console.log("response: login response:", response);
                    props.onLoginResult(false);
                })
                .catch(function (error) {
                    console.error(error);
                    console.log("response: login response: failed");
                    resetForm();
                    props.onLoginResult(true);
                });
              }}>login
            </Button>
          </div>
        </div>
      </div>
      <div className="row"><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/></div>
    </div>
  )
}
