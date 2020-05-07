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
  const [ name, setName ] = useState("");
  const [ id, setId ] = useState(0);
  const [ nic, setNIC ] = useState("");
  const [ mobile, setMoble ] = useState("");
  const [ address, setAddress ] = useState("");
  const [ email, setEmail ] = useState("");

  const [ wardens, setWardens ] = useState([]);
  const [ addWardenBtnType, setAddWardenBtnType ] = useState(<AddIcon/>);
  const [ wardenActionType, setWardenActionType ] = useState('addWarden');
  const [ wardenGridHeight, setwardenGridHeight ] = useState("600px")
  const [ wardenGridApi, setWardenGridApi ] = useState({});

  const [ locations, setLocations ] = useState([]);
  const [ addLocationBtnType, setAddLocationBtnType ] = useState(<AddLocationIcon/>);
  const [ locationActionType, setLocationActionType ] = useState('addLocation');
  const [ locationGridHeight, setlocationGridHeight ] = useState("0px")
  const [ locationGridApi, setLocationGridApi ] = useState({});
  
  const [ dialogText, setDialogText ] = useState("")
  const [ open, setOpen] = useState(false);
  
  
  const wardenGridProp = {
    columnDefs: [
      { headerName: "", field: "id" , width:50, sortable: true},
      { headerName: "Name", field: "name" , width:200, sortable: true, filter: true},
      { headerName: "NIC", field: "nic" ,  width:100, sortable: true, filter: true},
      { headerName: "Mobile", field: "mobile" ,  width:150, filter: true},
      { headerName: "#",
        field: "color",
        width:10,
        cellStyle: function(param) {
          return {color: param.value, backgroundColor: param.value};
        },
        filter: false
      },
    ],
  }

  const locationGridProp = {
    columnDefs: [
      { headerName: "", field: "id" , width:50, sortable: true},
      { headerName: "Name", field: "lname" , width:200, sortable: true, filter: true},
      { headerName: "City", field: "city" ,  width:200, sortable: true, filter: true},
      { headerName: "# slots", field: "slots" ,  width:100, filter: true},
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

  function setSaveMode()
  {
    setAddWardenBtnType(<SaveIcon/>);
    setWardenActionType('saveWarden');
  }

  function locationAssignModeOn()
  {
    setwardenGridHeight('200px')
    setlocationGridHeight('300px')
    setAddLocationBtnType(<SaveIcon/>);
    setLocationActionType('saveLocation');
    loadLocations();
  }

  function resetSubmitForm()
  {
    setAddLocationBtnType(<AddLocationIcon/>);
    setAddWardenBtnType(<AddIcon/>);
    setWardenActionType('addWarden');
    setLocationActionType('addLocation');
    setName("");
    setNIC("");
    setMoble("");
    setAddress("");
    setEmail("");
    setwardenGridHeight('600px')
    setlocationGridHeight('0px')
  }

  function getSelectedWardenId()
  {
    const selectedNodes = wardenGridApi.getSelectedNodes()
    const selectedData = selectedNodes.map( node => node.data )
    return selectedData.map( node => node.id)
  }

  function getSelectedlocationsIds() {
    const selectedNodes = locationGridApi.getSelectedNodes()
    const selectedData = selectedNodes.map( node => node.data )
    return selectedData.map( node => node.id);
  }

  function loadLocations()
  {
    axios.get(`http://localhost:8080/locations`)
    .then(res => {
      const response =  res.data;
      const filtered = [];
      response.map(i => {
        if (i.warden == null) filtered.push(i);
      });      
      setLocations(filtered);
      
      console.log("response:load locations", response);
      console.log("filtered locations", filtered);
    });
  }

  function loadWardens()
  {
    axios.get(`http://localhost:8080/wardens`)
    .then(res => {
      const response =  res.data;
      setWardens(response);
      console.log("response:load wardens", wardens);
    });
  }

  // onload
  useEffect(()=>{
    loadWardens();
    loadLocations();
  },[])

  return(
      <div className="container">
      <div className="row">
        <div className="col-md-6">
          <p className="textAlignCenter"></p>
          <div className="ag-theme-balham" style={{height: wardenGridHeight, width: '530px'}}>
            <AgGridReact pagination={true}
              columnDefs={wardenGridProp.columnDefs}
              rowData={wardens}
              onGridReady={(params)=>setWardenGridApi(params.api)}
              rowSelection={'single'}
            />
          </div>
          <div className="ag-theme-balham" style={{height: locationGridHeight, width: '530px'}}>
            <AgGridReact pagination={true}
              columnDefs={locationGridProp.columnDefs}
              rowData={locations}
              onGridReady={(params)=>setLocationGridApi(params.api)}
              rowSelection={'multiple'}
            />
          </div>
        </div>
        <div className="col-md-1">
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={<DetailIcon/>}
              onClick={() => {
                const wardenId = getSelectedWardenId();
                console.log('info warden-id:' + wardenId);
                if (wardenId.length) {
                  axios.get(`http://localhost:8080/wardens/`+ wardenId)
                  .then(res => {
                    const response =  res.data;
                    console.log("response: get warden", response);
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
            <Button variant="contained" color="primary" size="large" startIcon={addLocationBtnType}
              onClick={() => {
                if (locationActionType == 'addLocation') {
                  console.log('attach location click');
                  const wardenId = getSelectedWardenId();
                  if (wardenId.length) {
                    console.log('attach warden-id:' + wardenId);
                    setId(wardenId);
                    locationAssignModeOn();
                  }
                } else{
                  console.log('attach location save click');
                  getSelectedlocationsIds().map(locationId => {
                    console.log('attach warden-id:' + id);
                    axios.put(`http://localhost:8080/assign?warden-id=`+ id, {"id": locationId})
                    .then(res => {
                      const response =  res.data;
                      console.log("response: attach warden:"+ id + " location:" + locationId + " :" + response);
                      loadWardens();
                    })
                    .catch(function (error) {
                      console.error(error);
                    });
                  });
                  resetSubmitForm();
                }
              }}/>
          </div>          
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={<LocationOff/>}
              onClick={() => {
                console.log('detach click');
                const wardenId = getSelectedWardenId();
                console.log('detach warden-id:' + wardenId);
                if (wardenId.length) {
                  axios.put(`http://localhost:8080/detach/`+ wardenId)
                  .then(res => {
                    const response =  res.data;
                    console.log("response: detach warden", response);
                    loadWardens();
                  })
                  .catch(function (error) {
                    console.error(error);
                  });
                }
              }}/>
          </div>
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={<EditIcon/>}
              onClick={() => {
                console.log('edit click');
                setSaveMode();
                const wardenId = getSelectedWardenId();
                console.log('edit warden-id:' + wardenId);
                if (wardenId.length) {
                  axios.get(`http://localhost:8080/wardens/`+ wardenId)
                  .then(res => {
                    const response =  res.data;
                    console.log("response: get warden", response);
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
                const wardenId = getSelectedWardenId();
                console.log('delete warden-id:' + wardenId);
                if (wardenId.length) {
                  axios.delete(`http://localhost:8080/wardens/`+ wardenId)
                  .then(res => {
                    console.info('response: deleted warden-id:'+ wardenId);
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
            <Button variant="contained" color="primary" size="large" startIcon={addWardenBtnType}
              onClick={() => {
                const obj = { 'name': name, 'nic': nic, 'mobile': mobile, 'address': address, 'email': email }
                if (name.length && nic.length && mobile.length && address.length && email.length) {
                  if (wardenActionType == 'addWarden') {
                    console.log('add click ' + JSON.stringify(obj));
                    axios.post(`http://localhost:8080/wardens`, obj)
                    .then(res => {
                      const response =  res.data;
                      console.log("response: add wardens response:", response);
                      loadWardens();
                    })
                  } else {
                    console.log('update click id:'+ id + ", " + JSON.stringify(obj));
                    axios.put(`http://localhost:8080/wardens/` + id, obj)
                    .then(res => {
                      const response =  res.data;
                      console.log("response: update wardens response:", response);
                      loadWardens();
                    })
                    .catch(function (error) {
                      console.error(error);
                    });
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
