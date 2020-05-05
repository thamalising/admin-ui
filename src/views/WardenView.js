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

export function WardenView(){
  
  const [ name, setName ] = useState("");
  const [ nic, setNIC ] = useState("");
  const [ mobile, setMoble ] = useState("");
  const [ address, setAddress ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ wardens, setWardens ] = useState([]);
  const [ btnType, setBtnType ] = useState(<AddIcon/>);
  const [ gridParam, setGridParam] = useState({});
  
  const state = {
    columnDefs: [
      { headerName: "Name", field: "name" , width:200, sortable: true, filter: true},
      { headerName: "NIC", field: "nic" ,  width:100, sortable: true, filter: true},
      { headerName: "Mobile", field: "mobile" ,  width:150, filter: true},
      { headerName: "",
        field: "color",
        width:50,
        cellStyle: function(param) {
          return {color: param.value, backgroundColor: param.value};
        },
        filter: true
      },
    ],
    rowSelection: 'single',
  }

  function resetSubmitForm()
  {
    setBtnType(<AddIcon/>);
    setName("");
    setNIC("");
    setMoble("");
    setAddress("");
    setEmail("");
  }

  function onSelectionChanged()
  {
    var row = gridParam.api.getSelectedRows();
    // document.querySelector('#selectedRows').innerHTML =
    // selectedRows.length === 1 ? selectedRows[0].athlete : '';
    console.log("###" + row.lenth);
  };

  function onGridReady(p)
  {
    setGridParam(p);
    // var selectedRows = state.getSelectedRows();
    // document.querySelector('#selectedRows').innerHTML =
    // selectedRows.length === 1 ? selectedRows[0].athlete : '';
    console.log("** " + p)
  };

  function loadWardens()
  {
    axios.get(`http://localhost:8080/wardens`)
    .then(res => {
      const response =  res.data;
      setWardens(response);
      console.log("load wardens response", response);
      console.log("load wardens", wardens);
    });
  }

  useEffect(()=>{
    loadWardens();
  },[])

  return(
      <div className="container">
      <div className="row">
        <div className="col-md-6">
          <p className="textAlignCenter"></p>
          <div className="ag-theme-balham" style={{height: '600px', width: '510px'}}>
            <AgGridReact pagination={true}
              columnDefs={state.columnDefs}
              rowData={wardens}
              onGridReady={(param)=>onGridReady(param)}
              rowSelection={state.rowSelection}
              onSelectionChanged={()=>onSelectionChanged()}
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={<DetailIcon/>}/>
          </div>
          <div className="btnWrapper">
            <Button variant="contained" color="primary" size="large" startIcon={<AddLocationIcon/>}/>
          </div>          
          <div className="btnWrapper">
          <Button variant="contained" color="primary" size="large" startIcon={<EditIcon/>}
              onClick={() => {
                console.log('edit click');
                setBtnType(<SaveIcon/>)
              }}/>
          </div>
          <div className="btnWrapper">
            <Button variant="contained" color="secondary" size="large" startIcon={<DeleteIcon/>}/>            
          </div>
        </div>
        <div className="col-md-4">
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
                console.log('+ click ' + JSON.stringify(obj));
                axios.post(`http://localhost:8080/wardens`, obj)
                .then(res => {
                  const response =  res.data;
                  console.log("+ wardens response:", response);
                  loadWardens();
                })
                resetSubmitForm();
              }}/>
          </div>
        </div>
      </div>
    </div>
  )
}
