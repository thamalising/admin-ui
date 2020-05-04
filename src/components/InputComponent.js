import './InputComponent.css';
import React from 'react';

export function InputComponent(props){
    return(
    <div>
        <input className={"inputComponent"} type="text" placeholder={props.placeholder} value={props.value} onChange={props.onChange}/>
    </div>
    )
}