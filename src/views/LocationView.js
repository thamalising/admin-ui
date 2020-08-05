import "./LocationView.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import DetailIcon from '@material-ui/icons/Details';
import LocationOff from '@material-ui/icons/LocationOff';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import {TmzDialog} from '../components/TmzDialog';
import { MapComponent } from '../components/MapComponent';
import ResetIcon from '@material-ui/icons/RestorePage';
import Tooltip from '@material-ui/core/Tooltip';

export function LocationView(){
  const [ id, setId ] = useState(0);
  const [ lname, setLocationName ] = useState("");
  const [ lon, setLongitude ] = useState("");
  const [ lat, setLatitude ] = useState("");
  const [ city, setCity ] = useState("");
  const [ slots, setSlots ] = useState("");

  const [ locations, setLocations ] = useState([]);
  const [ addLocationBtnType, setAddLocationBtnType ] = useState(<AddLocationIcon/>);
  const [ locationActionType, setLocationActionType ] = useState('addLocation');
  const [ locationGridHeight, setlocationGridHeight ] = useState("500px");
  const [ locationGridApi, setLocationGridApi ] = useState(null);
  
  const [ detailLoctionDialog, setDetailLocationDialog ] = useState("");
  const [showMap, setShowMap] = useState(false);
  
  const locationGridProp = {
    columnDefs: [
      { headerName: "", field: "id" , width:50, sortable: true, hide: true},
      { headerName: "", field: "id1" , width:50, sortable: true},
      { headerName: "Name", field: "lname" , width:200, sortable: true, filter: true},
      { headerName: "City", field: "city" ,  width:200, sortable: true, filter: true},
      { headerName: "Slots", field: "slots" ,  width:70, filter: true},
      { headerName: "Allocated Slots", field: "bc" ,  width:150, filter: true},
      { headerName: "",
        field: "warden",
        width:10,
        cellStyle: function(param) { // custom style for cell
          if (param.value == null) // if no warden assign
            return {color: '#FFFFFF', backgroundColor: '#FFFFFF'};
          else // if location belongs warden
            return {color: '#FF0000', backgroundColor: '#FF0000'};
        },
        filter: false
      },
    ],
  }
  // call on add-location
  function setSaveModeFromAddButton()
  {
    setAddLocationBtnType(<SaveIcon/>);
    setLocationActionType('addLocation');
    setShowMap(true)
  }

  function setSaveModeFromEditButton()
  {
    setAddLocationBtnType(<SaveIcon/>);
    setLocationActionType('saveLocation');
    setShowMap(true)
  }

  // reset form to initial view
  function resetSubmitForm()
  {
    setAddLocationBtnType(<AddLocationIcon/>);
    setLocationActionType('addLocation');
    setLocationName("");
    setCity("");
    setLongitude("");
    setLatitude("");
    setSlots("");
    setShowMap(false);
  }

  function getSelectedlocationsId() {
    // get grid api
    const selectedNodes = locationGridApi.getSelectedNodes()
    // get list with node's data
    const selectedData = selectedNodes.map( node => node.data )
    // return list with above data's id
    return selectedData.map( node => node.id);
  }

  function loadLocations()
  {
    axios.get(`http://localhost:8080/locations`)
    .then(res => {
      const response =  res.data;
      const newLocations = response.map((o, i)=> {
        // additional field to keep sequence number
          o['id1'] = i + 1
          return o;
      });
      // override new field added locations
      setLocations(newLocations);
      
      console.log("response:load locations", response);
      console.log("filtered locations", response);
    });
  }

  // function calling from on map-click
  function onClickedOnMap(latlng)
  {
    setLatitude(latlng[0]);
    setLongitude(latlng[1]);
    console.log('onMapClicked callback latlng:' + latlng);
  }
  
  // onload
  useEffect(()=>{
    loadLocations();
  },[])

  return(
      <div className="container-location">
      <div className="row"><br/></div>
      <div className="row">
        <div className="col-md-6">
          <div className="ag-theme-balham" style={{height: locationGridHeight, width: '700px'}}>
            {/* show grid if no map mode on */}
            {!showMap && <AgGridReact pagination={true}
              paginationPageSize={15}
              columnDefs={locationGridProp.columnDefs}
              rowData={locations}
              onGridReady={(params)=>setLocationGridApi(params.api)}
              rowSelection={'single'}
            />}
            {/* map shows only if showmap state asked to show */}
            {showMap && <MapComponent onMapClick={onClickedOnMap}/>}
          </div>
        </div>
        {/* View Location Details  */}
        <div className="col-md-1">
          <div className="btnWrapper">
          <Tooltip title="View Location">
            <Button variant="contained" color="primary" size="large" startIcon={<DetailIcon/>}
              onClick={() => {
                const locationId = getSelectedlocationsId();
                console.log('info location-id:' + locationId);
                if (locationId.length) {
                  axios.get(`http://localhost:8080/locations/`+ locationId)
                  .then(res => {
                    const response =  res.data;
                    console.log("response: get location", response);
                    //Set location data on dialog box
                    setDetailLocationDialog(<TmzDialog
                      onClickOk={()=>{setDetailLocationDialog(null)}}
                      message={'name:' + response.lname
                      + ', city:' + response.city
                      + ', longitude:' + response.lon
                      + ', latitude:' + response.lat
                      + ', slots:'+ response.slots
                      + (response.warden == null ? '' : ', warden[ name:' + response.warden.name 
                      + ', id:' + response.warden.id
                      + ', mobile:' + response.warden.mobile + ']')}
                      title={'Location Details'}
                      />);
                    
                  })
                  .catch(function (error) {
                    console.error(error);
                  });
                }
              }
            }/>
            </Tooltip>
           {detailLoctionDialog} 
          </div>
          {/* Edit Location Icon Click  */}
          <div className="btnWrapper">
            <Tooltip title="Edit Location">
            <Button variant="contained" color="primary" size="large" startIcon={<EditIcon/>}
              onClick={() => {
                console.log('edit click');
                const locationId = getSelectedlocationsId();
                console.log('edit location-id:' + locationId);
                if (locationId.length) {
                  setSaveModeFromEditButton();
                  axios.get(`http://localhost:8080/locations/`+ locationId[0])
                  .then(res => {
                    const response =  res.data;
                    console.log("response: get location", response);
                    setId(response.id);
                    setLocationName(response.lname);
                    setCity(response.city);
                    setLongitude(response.lon);
                    setLatitude(response.lat);
                    setSlots(response.slots);
                  })
                  .catch(function (error) {
                    console.error(error);
                  });
                }
              }}/>
              </Tooltip>
          </div>
          {/* Reassign warden from the location  */}
          <div className="btnWrapper">
            <Tooltip title="Reassign Warden">
            <Button variant="contained" color="primary" size="large" startIcon={<LocationOff/>}
              onClick={() => {
                console.log('location detach click');
                const locationId = getSelectedlocationsId();
                console.log('detach location-id:' + locationId);
                if (locationId.length) {
                  console.log('detach location-id:' + locationId);
                  axios.put(`http://localhost:8080/locations/detach?location-id=`+ locationId)
                  .then(res => {
                    const response =  res.data;
                    console.log("response: detach location", response);
                    loadLocations();
                  })
                  .catch(function (error) {
                    console.error(error);
                  });
                }
              }}/>
              </Tooltip>
          </div>    
          {/* Delete Location */}
          <div className="btnWrapper">
            <Tooltip title="Delete Location">
            <Button variant="contained" color="secondary" size="large" startIcon={<DeleteIcon/>} 
              onClick={() => {
                const locationId = getSelectedlocationsId();
                console.log('delete location-id:' + locationId);
                // if list has location ids ?
                if (locationId.length) {
                  //DELETE API request call on Delete Locations
                  axios.delete(`http://localhost:8080/locations/`+ locationId[0])
                  .then(res => {
                    console.info('response: deleted location-id:'+ locationId);
                    loadLocations();
                  })
                  .catch(function (error) {
                    console.error(error);
                  });
                }
              }}/>
            </Tooltip>
          </div>
          {/* Reset button  */}
          <div className="btnWrapper">
            <Tooltip title="Reset Location">
            <Button variant="contained" color="primary" size="large" startIcon={<ResetIcon/>}
              onClick={() => {
                resetSubmitForm();
              }}/>
            </Tooltip>
          </div>
        </div>
        {/* Add location  */}
        <div className="col-md-5">
          <p className="textAlignCenter"></p>
          <div className="inputFieldWrapper" >
            <TextField label={"Name"} value={lname} fullWidth={true} onChange={(event)=>setLocationName(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <TextField label={"City"} value={city} fullWidth={true} onChange={(event)=>setCity(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <TextField label={"No of slots"} value={slots} fullWidth={true} onChange={(event)=>setSlots(event.target.value)}/>
          </div>
          <div className="btnWrapper">
            <Tooltip title="Add Location">
            <Button variant="contained" color="primary" size="large" startIcon={addLocationBtnType}
              onClick={() => {
                // create json object to call REST post/put
                const obj = { 'lname': lname, 'lon': lon, 'lat': lat, 'city': city, 'slots': slots }
                // if lan lot not there on the map mode
                if (lon == 0 && lat == 0) {
                  setSaveModeFromAddButton();
                  return;
                }
                
                if (lname.length && lon > 0 && lat > 0 && city.length && slots > 0) {
                  if (locationActionType == 'addLocation') {
                    //Save new location
                    //POST API request call on Add
                    console.log('add click ' + JSON.stringify(obj));
                    axios.post(`http://localhost:8080/locations`, obj)
                    .then(res => {
                      const response =  res.data;
                      console.log("response: add locations response:", response);
                      loadLocations();
                    })
                  } else {
                    //Update existing location
                    //PUT API request call on update
                    console.log('update click id:'+ id + ", " + JSON.stringify(obj));
                    axios.put(`http://localhost:8080/locations/` + id, obj)
                    .then(res => {
                      const response =  res.data;
                      console.log("response: update locations response:", response);
                      loadLocations();
                    })
                    .catch(function (error) {
                      console.error(error);
                    });
                  }
                } else console.error('input error:' + JSON.stringify(obj))
                resetSubmitForm();

              }}/>
            </Tooltip>
               {/* <span> </span> */}            
          </div>
          <div className="inputFieldWrapper">
            <TextField disabled label={"Latitude:Longitude"} value={lat.length == 0 ? '' : lat +':' + lon} fullWidth={true}/>
          </div>    
        </div>
      </div>
      <div className="row"><br/><br/><br/><br/><br/></div>
    </div>
  )
}
