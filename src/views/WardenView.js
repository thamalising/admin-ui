import "./WardenView.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputComponent } from '../components/InputComponent';
import { ButtonComponent } from '../components/ButtonComponent';
import { AgGridReact } from 'ag-grid-react';

export function WardenView(){
  
  const [ name, setName ] = useState("");
  const [ nic, setNIC ] = useState("");
  const [ mobile, setMoble ] = useState("");
  const [ address, setAddress ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ wardens, setWardens ] = useState([]);
  const [ btnText, setBtnText ] = useState("add");
  
  const state = {
    columnDefs: [
      { headerName: "Name", field: "name" , width:200, checkboxSelection: true, sortable: true, filter: true},
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
    // rowData: [
    //   { name: "somapala", nic: "882423050v", mobile:"+94719373500", job: "#DAF7A6"},
    //   { name: "somapala", nic: "882423050v", mobile:"+94719373500", job: "#FFC300"},
    //   { name: "somapala", nic: "882423050v", mobile:"+94719373500", job: "#FF5733"},
    //   { name: "somapala", nic: "882423050v", mobile:"+94719373500", job: "#900C3F"},
    // ]
  }

  function submitBtnOnclick()
  {
    setBtnText("add")
    setName("")
    setNIC("")
    setMoble("")
    setAddress("")
    setEmail("")
  }


  useEffect(()=>{
    axios.get(`http://localhost:8080/wardens`)
    .then(res => {
      const response =  res.data;
      setWardens(response);
      console.log("load wardens response", response);
      console.log("load wardens", wardens);
    })
  },[])

  return(
      <div className="container">
      <div className="row">
        <div className="col-md-6">
          <p className="textAlignCenter"></p>
          <div className="ag-theme-balham" style={{height: '600px', width: '510px'}}>
            <AgGridReact pagination={true} columnDefs={state.columnDefs} rowData={wardens}/>
          </div>
        </div>
        <div className="col-md-2">
          <div className="btnWrapper">
            <ButtonComponent btnText={"detail"} onClick={()=>submitBtnOnclick()}/>
          </div>
          <div className="btnWrapper">
            <ButtonComponent btnText={"assign"} onClick={()=>submitBtnOnclick()}/>
          </div>          
          <div className="btnWrapper">
            <ButtonComponent btnText={"edit"} onClick={()=>{setBtnText("update")}}/>
          </div>
          <div className="btnWrapper">
            <ButtonComponent btnText={"delete"} onClick={()=>submitBtnOnclick()}/>
          </div>
          <div className="btnWrapper">
            <ButtonComponent btnText={"load"} onClick={()=>submitBtnOnclick()}/>
          </div>
        </div>
        <div className="col-md-4">
          <p className="textAlignCenter"></p>
          <div className="inputFieldWrapper">
            <InputComponent placeholder={"Name"} value={name} onChange={(event)=>setName(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <InputComponent placeholder={"NIC"} value={nic} onChange={(event)=>setNIC(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <InputComponent placeholder={"Mobile"} value={mobile} onChange={(event)=>setMoble(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <InputComponent placeholder={"Address"} value={address} onChange={(event)=>setAddress(event.target.value)}/>
          </div>
          <div className="inputFieldWrapper">
            <InputComponent placeholder={"Email"} value={email} onChange={(event)=>setEmail(event.target.value)}/>
          </div>
          <div className="btnWrapper">
            <ButtonComponent btnText={btnText} onClick={()=>submitBtnOnclick()}/>
          </div>
        </div>
      </div>
    </div>
  )
}
