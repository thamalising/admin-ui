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
import {TmzDialog} from '../components/TmzDialog';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import Tooltip from '@material-ui/core/Tooltip';
import ResetIcon from '@material-ui/icons/RestorePage';

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
  const [ wardenGridHeight, setwardenGridHeight ] = useState("500px")
  const [ wardenGridApi, setWardenGridApi ] = useState({});

  const [ locations, setLocations ] = useState([]);
  const [ addLocationBtnType, setAddLocationBtnType ] = useState(<AddLocationIcon/>);
  const [ locationActionType, setLocationActionType ] = useState('addLocation');
  const [ locationGridHeight, setlocationGridHeight ] = useState("0px")
  const [ locationGridApi, setLocationGridApi ] = useState({});
  
  const [ detailDialog, setDetailDialog ] = useState(null);
  const [ wardenDeleteDialog, setWardenDeleteDialog ] = useState(null);
  
  const wardenGridProp = {
    columnDefs: [
      { headerName: "", field: "id" , width:50, sortable: true, hide: true},
      { headerName: "", field: "id1" , width:50, sortable: true},
      { headerName: "Name", field: "name" , width:200, sortable: true, filter: true},
      { headerName: "NIC", field: "nic" ,  width:100, sortable: true, filter: true},
      { headerName: "Mobile", field: "mobile" ,  width:130, filter: true},
      { headerName: "Address", field: "address" ,  width:200, filter: true},
      { headerName: "#",
        field: "color",
        width:10,
        cellStyle: (param) =>{return {color: param.value, backgroundColor: param.value}},
        filter: false
      },
    ],
  }

  const locationGridProp = {
    columnDefs: [
      { headerName: "", field: "id" , width:50, sortable: true, hide: true},
      { headerName: "", field: "id2" , width:50, sortable: true},
      { headerName: "Name", field: "lname" , width:200, sortable: true, filter: true},
      { headerName: "City", field: "city" ,  width:200, sortable: true, filter: true},
      { headerName: "# slots", field: "slots" ,  width:100, filter: true},
    ],
  }

  function setSaveMode()
  {
    setAddWardenBtnType(<SaveIcon/>);
    setWardenActionType('saveWarden');
  }

  //Call on Assign Locations button
  function locationAssignModeOn()
  {
    setwardenGridHeight('300px')
    setlocationGridHeight('300px')
    setAddLocationBtnType(<SaveIcon/>);
    setLocationActionType('saveLocation');
    loadLocations();
  }

  //Reset
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
    setwardenGridHeight('500px')
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

  //Load location grid
  function loadLocations()
  {
    axios.get(`http://localhost:8080/locations`)
    .then(res => {
      const response =  res.data;
      const filtered = [];
      //get locations which are not assigned a warden
      response.map(i => {
        if (i.warden == null) filtered.push(i);
      });      
      const newLoc = filtered.map((o, i)=> {
        // additional field to keep sequence number
          o['id2'] = i + 1
          return o;
      });
      setLocations(newLoc);
      
      console.log("response:load locations", response);
      console.log("filtered locations", newLoc);
    });
  }

  function loadWardens()
  {
    axios.get(`http://localhost:8080/wardens`)
    .then(res => {
      const response =  res.data;
      const newWardens = response.map((o, i)=> {
        // additional field to keep sequence number
          o['id1'] = i + 1
          return o;
      });
      setWardens(newWardens);
      console.log("response:load wardens", newWardens);
    });
  }

  // onload
  useEffect(()=>{
    loadWardens();
    loadLocations();
  },[])

  return(
      <div className="container-warden">
      <div className="row">
        <div className="col-md-6">
          <p className="textAlignCenter"></p>
          <div className="ag-theme-balham-dark" style={{height: wardenGridHeight, width: '720px'}}>
            <AgGridReact pagination={true}
              paginationPageSize={15}
              columnDefs={wardenGridProp.columnDefs}
              rowData={wardens}
              onGridReady={(params)=>setWardenGridApi(params.api)}
              rowSelection={'single'}
            />
          </div>
          <div className="ag-theme-balham-dark" style={{height: locationGridHeight, width: '720px'}}>
            <AgGridReact pagination={true}
              paginationPageSize={15}
              columnDefs={locationGridProp.columnDefs}
              rowData={locations}
              onGridReady={(params)=>setLocationGridApi(params.api)}
              rowSelection={'multiple'}
            />
          </div>
        </div>
        {/* View Warden Details  */}
        <div className="col-md-1">
          <div className="btnWrapper">
          <Tooltip title="View Warden">
            <Button variant="contained" color="primary" size="large" startIcon={<DetailIcon/>}
              onClick={() => {
                const wardenId = getSelectedWardenId();
                console.log('info warden-id:' + wardenId);
                if (wardenId.length) {
                  axios.get(`http://localhost:8080/wardens/`+ wardenId)
                  .then(res => {
                    const response =  res.data;
                    console.log("response: get warden", response);
                    setDetailDialog(<TmzDialog
                      onClickOk={()=>{setDetailDialog(null)}}
                      message={'name:' + response.name
                      + ', nic:' + response.nic
                      + ', mobile:' + response.mobile
                      + ', address:' + response.address
                      + ', email:'+ response.email}
                      title={'Warden Details'}
                    />);
                  })
                  .catch(function (error) {
                    console.error(error);
                  });
                }
              }
            }/>
            </Tooltip>
            {detailDialog}
          </div>
          <div className="btnWrapper">
            <Tooltip title={locationActionType == 'addLocation' ? "Assign Locations": "Save"}>
            <Button variant="contained" color="primary" size="large" startIcon={addLocationBtnType}
              onClick={() => {
                //Assign Locations Icon Click
                if (locationActionType == 'addLocation') {
                  console.log('attach location click');
                  const wardenId = getSelectedWardenId();
                  if (wardenId.length) {
                    console.log('attach warden-id:' + wardenId[0]);
                    setId(wardenId[0]);
                    locationAssignModeOn();
                  }
                } else{
                  //Update warden by assigning locaton/s
                  console.log('attach location save click');
                  getSelectedlocationsIds().map(i => {
                    console.log('attach warden-id:' + id);
                    const obj = {"id": i}; // create location object but only with id
                    axios.put(`http://localhost:8080/assign?warden-id=`+ id, obj)
                    .then(res => {
                      const response =  res.data;
                      console.log("response: attach warden:"+ id + " location:" + i + " :" + response);
                      loadWardens();
                    })
                    .catch(function (error) {
                      console.error(error);
                    });
                  });
                  resetSubmitForm();
                }
              }}/>
              </Tooltip>
          </div>    
          {/* Remove locations from the warden  */}
          <div className="btnWrapper">
            <Tooltip title="Set Free">
            <Button variant="contained" color="primary" size="large" startIcon={<LocationOff/>}
              onClick={() => {
                console.log('detach click');
                const wardenId = getSelectedWardenId();
                console.log('detach warden-id:' + wardenId);
                if (wardenId.length) {
                  //PUT API request call on Update Warden
                  axios.put(`http://localhost:8080/detach/`+ wardenId[0])
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
              </Tooltip>
          </div>
          {/* Edit Warden Icon Click  */}
          <div className="btnWrapper">
            <Tooltip title="Edit Warden">
            <Button variant="contained" color="primary" size="large" startIcon={<EditIcon/>}
              onClick={() => {
                console.log('edit click');
                setSaveMode();
                const wardenId = getSelectedWardenId();
                console.log('edit warden-id:' + wardenId);
                if (wardenId.length) {                  
                  axios.get(`http://localhost:8080/wardens/`+ wardenId[0])
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
              </Tooltip>
          </div>
          {/* Delete Warden  */}
          <div className="btnWrapper">
            <Tooltip title="Delete Warden">
            <Button variant="contained" color="secondary" size="large" startIcon={<DeleteIcon/>} 
              onClick={() => {
                const wardenId = getSelectedWardenId();
                console.log('delete warden-id:' + wardenId);
                if (wardenId.length) {
                  //DELETE API request call on Delete Locations
                  axios.delete(`http://localhost:8080/wardens/`+ wardenId[0])
                  .then(res => {
                    console.info('response: deleted warden-id:'+ wardenId);
                    loadWardens();
                  })
                  .catch(function (error) {
                    console.error(error);
                  })                  
                }
              }}/>
              </Tooltip>
          </div>
          {/* Reset button  */}
          <div className="btnWrapper">
            <Tooltip title="Reset">
            <Button variant="contained" color="primary" size="large" startIcon={<ResetIcon/>}
              onClick={() => {
                resetSubmitForm();
              }}/>
            </Tooltip>
          </div>
        </div>
        {/* Add Warden  */}
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
            <Tooltip title={wardenActionType == 'addWarden' ? "Add Warden" : "Save Warden"}>
            <Button variant="contained" color="primary" size="large" startIcon={addWardenBtnType}
              onClick={() => {
                //Save new warden
                const obj = { 'name': name, 'nic': nic, 'mobile': mobile, 'address': address, 'email': email }
                if (name.length && nic.length && mobile.length && address.length && email.length) {
                  if (wardenActionType == 'addWarden') {
                    //POST API request call on Add
                    console.log('add click ' + JSON.stringify(obj));
                    axios.post(`http://localhost:8080/wardens`, obj)
                    .then(res => {
                      const response =  res.data;
                      console.log("response: add wardens response:", response);
                      loadWardens();
                    })
                  } else {
                    //Update existing warden
                    //PUT API request call on update
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
              </Tooltip>
          </div>
        </div>
      </div>
      <div className="row"><br/><br/><br/><br/><br/><br/></div>
    </div>
  )
}
