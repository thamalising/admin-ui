import "./WardenView.css";
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { MapComponent } from '../components/MapComponent';

export function LocationView(){
  const [ id, setId ] = useState(0);
  const [ lname, setLocationName ] = useState("");
  const [ lon, setLongitude ] = useState("");
  const [ lat, setLatitude ] = useState("");
  const [ city, setCity ] = useState("");
  const [ slots, setSlots ] = useState("");
  const [ warden, setWarden ] = useState(null);


  const [ locations, setLocations ] = useState([]);
  const [ addLocationBtnType, setAddLocationBtnType ] = useState(<AddLocationIcon/>);
  const [ locationActionType, setLocationActionType ] = useState('addLocation');
  const [ locationGridHeight, setlocationGridHeight ] = useState("500px")
  const [ locationGridApi, setLocationGridApi ] = useState({});
  
  const [ dialogText, setDialogText ] = useState("")
  const [ open, setOpen] = useState(false);

  const [showMap, setShowMap] = useState(false);
  
  const locationGridProp = {
    columnDefs: [
      { headerName: "", field: "id" , width:50, sortable: true},
      { headerName: "Name", field: "lname" , width:200, sortable: true, filter: true},
      { headerName: "City", field: "city" ,  width:200, sortable: true, filter: true},
      { headerName: "# slots", field: "slots" ,  width:50, filter: true},
      { headerName: "",
        field: "warden",
        width:10,
        cellStyle: function(param) {
          if (param.value == null)
            return {color: '#FFFFFF', backgroundColor: '#FFFFFF'};
          else
            return {color: '#FF0000', backgroundColor: '#FF0000'};
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

  const dialogOpen = () => {
    setOpen(true);
  };

  const dialogClose = () => {
    setOpen(false);
  };
  // [end]

  function resetSubmitForm()
  {
    setAddLocationBtnType(<AddLocationIcon/>);
    setLocationActionType('addLocation');
    setLocationName("");
    setCity("");
    setLongitude("");
    setLatitude("");
    setSlots("");
    setWarden(null);
    setShowMap(false);
  }

  function getSelectedlocationsId() {
    const selectedNodes = locationGridApi.getSelectedNodes()
    const selectedData = selectedNodes.map( node => node.data )
    return selectedData.map( node => node.id);
  }

  function loadLocations()
  {
    axios.get(`http://localhost:8080/locations`)
    .then(res => {
      const response =  res.data;
      setLocations(response);
      
      console.log("response:load locations", response);
      console.log("filtered locations", response);
    });
  }

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
      <div className="container">
      <div className="row">
        <div className="col-md-6">
          <p className="textAlignCenter"></p>
          <div className="ag-theme-balham" style={{height: locationGridHeight, width: '530px'}}>
            {!showMap && <AgGridReact pagination={true}
              columnDefs={locationGridProp.columnDefs}
              rowData={locations}
              onGridReady={(params)=>setLocationGridApi(params.api)}
              rowSelection={'single'}
            />}

            {showMap && <MapComponent onMapClick={onClickedOnMap}/>}
          </div>
        </div>
        <div className="col-md-1">
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={<DetailIcon/>}
              onClick={() => {
                const locationId = getSelectedlocationsId();
                console.log('info location-id:' + locationId);
                if (locationId.length) {
                  axios.get(`http://localhost:8080/locations/`+ locationId)
                  .then(res => {
                    const response =  res.data;
                    console.log("response: get location", response);
                    setDialogText('name:' + response.lname
                      + ', city:' + response.city
                      + ', longitude:' + response.lon
                      + ', latitude:' + response.lat
                      + ', slots:'+ response.slots
                      + (response.warden == null ? '' : ', warden[ name:' + response.warden.name 
                      + ', id:' + response.warden.id
                      + ', mobile:' + response.warden.mobile + ']')
                      );
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
                Location Details
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
            <Button variant="contained" color="primary" size="large" startIcon={<EditIcon/>}
              onClick={() => {
                console.log('edit click');
                setSaveModeFromEditButton();
                const locationId = getSelectedlocationsId();
                console.log('edit location-id:' + locationId);
                if (locationId.length) {
                  axios.get(`http://localhost:8080/locations/`+ locationId)
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
          </div>
          <div className="btnWrapper">
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
          </div>          
          <div className="btnWrapper">
            <Button variant="contained" color="secondary" size="large" startIcon={<DeleteIcon/>} 
              onClick={() => {
                const locationId = getSelectedlocationsId();
                console.log('delete location-id:' + locationId);
                if (locationId.length) {
                  axios.delete(`http://localhost:8080/locations/`+ locationId)
                  .then(res => {
                    console.info('response: deleted location-id:'+ locationId);
                    loadLocations();
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
            <TextField label={"Name"} value={lname} fullWidth={true} onChange={(event)=>setLocationName(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <TextField label={"City"} value={city} fullWidth={true} onChange={(event)=>setCity(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <TextField label={"# of slots"} value={slots} fullWidth={true} onChange={(event)=>setSlots(event.target.value)}/>
          </div>
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={addLocationBtnType}
              onClick={() => {
                const obj = { 'lname': lname, 'lon': lon, 'lat': lat, 'city': city, 'slots': slots }
                // if lan lot not there on the map mode
                if (lon == 0 && lat == 0) {
                  setSaveModeFromAddButton();
                  return;
                }
                
                if (lname.length && lon > 0 && lat > 0 && city.length && slots > 0) {
                  if (locationActionType == 'addLocation') {
                    console.log('add click ' + JSON.stringify(obj));
                    axios.post(`http://localhost:8080/locations`, obj)
                    .then(res => {
                      const response =  res.data;
                      console.log("response: add locations response:", response);
                      loadLocations();
                    })
                  } else {
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
          </div>
          <div className="inputFieldWrapper">
            <TextField disabled label={"Latitude:Longitude"} value={lat.length == 0 ? '' : lat +':' + lon} fullWidth={true}/>
          </div>          
        </div>
      </div>
    </div>
  )
}
