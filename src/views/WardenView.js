import "./WardenView.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import DetailIcon from '@material-ui/icons/Details';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import LocationOff from '@material-ui/icons/LocationOff';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

export function WardenView(){
  const [ open, setOpen] = useState(false);
  const [ name, setName ] = useState("");
  const [ id, setId ] = useState(0);
  const [ nic, setNIC ] = useState("");
  const [ mobile, setMoble ] = useState("");
  const [ address, setAddress ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ wardens, setWardens ] = useState([]);
  const [ btnType, setBtnType ] = useState(<AddIcon/>);
  const [ actionType, setActionType ] = useState('add');
  const [ gridApi, setgridApi ] = useState({});
  const [ dialogText, setDialogText ] = useState("")
  
  const state = {
    columnDefs: [
      { headerName: "", field: "id" , width:50, sortable: true},
      { headerName: "Name", field: "name" , width:200, sortable: true, filter: true},
      { headerName: "NIC", field: "nic" ,  width:100, sortable: true, filter: true},
      { headerName: "Mobile", field: "mobile" ,  width:150, filter: true},
      { headerName: "",
        field: "color",
        width:10,
        cellStyle: function(param) {
          return {color: param.value, backgroundColor: param.value};
        },
        filter: false
      },
    ],
  }

  // draggable dialog related functions
  // [start]
  function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
  } 

  const dialogOpen = () => {
    setOpen(true);
  };

  const dialogClose = () => {
    setOpen(false);
  };
  // [end]

  // utils
  // [start]
  function setSaveMode()
  {
    setBtnType(<SaveIcon/>);
    setActionType('save');
  }

  function resetSubmitForm()
  {
    setBtnType(<AddIcon/>);
    setActionType('add');
    setName("");
    setNIC("");
    setMoble("");
    setAddress("");
    setEmail("");
  }

  function getWardenId() {
    const selectedNodes = gridApi.getSelectedNodes()
    const selectedData = selectedNodes.map( node => node.data )
    return selectedData.map( node => node.id)
  }

  function loadWardens()
  {
    axios.get(`http://localhost:8080/wardens`)
    .then(res => {
      const response =  res.data;
      setWardens(response);
      console.log("load wardens", wardens);
    });
  }
  // [end]

  // onload
  useEffect(()=>{
    loadWardens();
  },[])

  return(
      <div className="container">
      <div className="row">
        <div className="col-md-6">
          <p className="textAlignCenter"></p>
          <div className="ag-theme-balham" style={{height: '600px', width: '530px'}}>
            <AgGridReact pagination={true}
              columnDefs={state.columnDefs}
              rowData={wardens}
              onGridReady={(params)=>setgridApi(params.api)}
              rowSelection={'single'}
            />
          </div>
        </div>
        <div className="col-md-1">
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={<DetailIcon/>}
              onClick={() => {
                const wardenId = getWardenId();
                console.log('info warden-id:' + wardenId);
                if (wardenId.length) {
                  axios.get(`http://localhost:8080/wardens/`+ wardenId)
                  .then(res => {
                    const response =  res.data;
                    console.log("get warden", response);
                    setDialogText('name:' + response.name
                      + ', nic:' + response.nic
                      + ', mobile:' + response.mobile
                      + ', address:' + response.address
                      + ', email:'+ response.email);
                    dialogOpen();
                  })
                  .catch(function (error) {
                    console.error(error);
                  });
                }
              }
            }/>
            <Dialog
              open={open}
              onClose={dialogClose}
              PaperComponent={PaperComponent}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Warden Details
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {dialogText}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={dialogClose} color="primary">
                  ok
                </Button>
              </DialogActions>
            </Dialog>            
          </div>
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={<AddLocationIcon/>}/>
          </div>
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={<LocationOff/>}/>
          </div>
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={<EditIcon/>}
              onClick={() => {
                console.log('edit click');
                setSaveMode();
                const wardenId = getWardenId();
                console.log('edit warden-id:' + wardenId);
                if (wardenId.length) {
                  axios.get(`http://localhost:8080/wardens/`+ wardenId)
                  .then(res => {
                    const response =  res.data;
                    console.log("get warden", response);
                    setId(response.id);
                    setName(response.name);
                    setNIC(response.nic);
                    setAddress(response.address);
                    setEmail(response.email);
                    setMoble(response.mobile);
                  })
                  .catch(function (error) {
                    console.error(error);
                  });
                }
              }}/>
          </div>
          <div className="btnWrapper">
            <Button variant="contained" color="secondary" size="large" startIcon={<DeleteIcon/>} 
              onClick={() => {
                const wardenId = getWardenId();
                console.log('delete warden-id:' + wardenId);
                if (wardenId.length) {
                  axios.delete(`http://localhost:8080/wardens/`+ wardenId)
                  .then(res => {
                    console.info('deleted warden-id:'+ wardenId);
                    loadWardens();
                  })
                  .catch(function (error) {
                    console.error(error);
                  });
                }
              }}/>
          </div>
        </div>
        <div className="col-md-5">
          <p className="textAlignCenter"></p>
          <div className="inputFieldWrapper" >
            <TextField label={"Name"} value={name} fullWidth={true} onChange={(event)=>setName(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <TextField label={"NIC"} value={nic} fullWidth={true} onChange={(event)=>setNIC(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <TextField label={"Mobile"} value={mobile} fullWidth={true} onChange={(event)=>setMoble(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <TextField label={"Address"} value={address} fullWidth={true} onChange={(event)=>setAddress(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <TextField label={"Email"} value={email} fullWidth={true} onChange={(event)=>setEmail(event.target.value)}/>
          </div>
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={btnType}
              onClick={() => {
                const obj = { 'name': name, 'nic': nic, 'mobile': mobile, 'address': address, 'email': email }
                if (name.length && nic.length && mobile.length && address.length && email.length) {
                  console.log('add click ' + JSON.stringify(obj));
                  if (actionType == 'add') {
                    axios.post(`http://localhost:8080/wardens`, obj)
                    .then(res => {
                      const response =  res.data;
                      console.log("add wardens response:", response);
                      loadWardens();
                    })
                  } else {
                    console.log('update click id:'+ id + ", " + JSON.stringify(obj));
                    if (id.length) {
                      axios.put(`http://localhost:8080/wardens/` + id, obj)
                      .then(res => {
                        const response =  res.data;
                        console.log("update wardens response:", response);
                        loadWardens();
                      })
                      .catch(function (error) {
                        console.error(error);
                      });
                    }
                  }
                }
                resetSubmitForm();
              }}/>
          </div>
        </div>
      </div>
    </div>
  )
}
