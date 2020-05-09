import React, { useState } from 'react';
import { InfoWindow, withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';

export function MapComponent(props)
{
    function onMapClick(e)
    {
        const latlng = [e.latLng.lat(), e.latLng.lng()];
        console.log('read clicked lanlot: ' + latlng);

        props.onMapClick(latlng);
    }

    const Map = withScriptjs(withGoogleMap((props) => (
        <GoogleMap
            defaultZoom={13}
            defaultCenter={{ lat: 6.9271, lng: 79.861244 }} // focus near colombo
            onClick={onMapClick}
        >
        </GoogleMap>)));

    return (
        <div style={{ height: '100%' , width:'100%'}}>
            <Map
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAIlyVMdZfUBPUKoQUiP5S3jalyUR-v3eI"
                loadingElement={ <div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `500px`}} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    )
}
