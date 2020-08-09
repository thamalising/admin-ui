import "./UserView.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { AgGridReact } from 'ag-grid-react';
import Tooltip from '@material-ui/core/Tooltip';
import GenerateIcon from '@material-ui/icons/NewReleasesRounded';

export function UserView(props){

  const [ id, setId ] = useState([]);
  const [ value, setValue ] = useState([]);
  const [ wardenid, setWardenId ] = useState([]);
  const [ users, setUsers ] = useState([]);
  const [ userGridApi, setUserGridApi ] = useState(null);

  const userGridProp = {
      columnDefs: [
        { headerName: "", field: "id" , width:50, sortable: true, hide: true},
        { headerName: "", field: "id1" , width:50, sortable: true},
        { headerName: "Name", field: "name" , width:200, sortable: true, filter: true},
        { headerName: "Email", field: "email" ,  width:200, sortable: true, filter: true},
        { headerName: "Token", field: "token" ,  width:200, filter: true},
      ],
    }

  function loadUsers()
  {
    axios.get(`http://localhost:8080/tokens`)
    .then(result => {
      const tokens =  result.data;
      console.log(tokens)
      // check warden after set tokens
      axios.get(`http://localhost:8080/wardens`)
      .then(res => {
        const response =  res.data;
        const newWardens = response.map((o, i)=> {
          // additional field to keep sequence number
          o['id1'] = i + 1
          // assign token
          tokens.map((t)=>{
            if (t['wardenId'] === o['id']) {
              o['token'] = t['value']
            }
          })

          return o;
        });
        console.log(newWardens)
        setUsers(newWardens);
      });

    });
  }

  function getSelectedUserId() {
    // get grid api
    const selectedNodes = userGridApi.getSelectedNodes()
    // get list with node's data
    const selectedData = selectedNodes.map( node => node.data )
    // return list with above data's id
    return selectedData.map( node => node.id);
  }

  useEffect(()=>{
      loadUsers();
  },[])

  return(
    <div className="container-user">
      <div className="row"><br/></div>
      <div className="row">
      <div className="col-md-6">
        <div className="ag-theme-balham-dark" style={{height: '500px', width: '700px'}}>
        <AgGridReact pagination={true}
          paginationPageSize={15}
          columnDefs={userGridProp.columnDefs}
          rowData={users}
          onGridReady={(params)=>setUserGridApi(params.api)}
          rowSelection={'single'}
        />
        </div>
      </div>
      <div className="col-md-1">
      <div className="btnResetWrapper">
            <Button variant="contained" color="primary" size="large" value="login"
              onClick={() => {
                const userId = getSelectedUserId();
                console.log(userId);
                if(userId.length){
                    axios.post(`http://localhost:8080/token/`+ userId[0])
                    .then(res => {
                      const response =  res.data;
                      console.log("response: get users", response);
                      loadUsers();
                    })
                    .catch(function (error) {
                      console.error(error);
                    });
                }
              }}>generate token
            </Button>
      </div>
      </div>
      <div className="col-md-5"/>
      </div>
      <div className="row"><br/><br/><br/><br/><br/></div>  
    </div>
  )
}
