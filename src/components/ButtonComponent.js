import React from 'react';
import './ButtonComponent.css';

export function ButtonComponent(props){
    return(
    <div>
        <button className="btnComponent" onClick={props.onClick}>{props.btnText}</button>
    </div>
    )
}