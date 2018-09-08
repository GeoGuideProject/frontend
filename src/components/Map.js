import React from 'react'

import styled from 'styled-components'

import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet'

const MapContainer = styled(LeafletMap)`
  width: 100%;
  height: 400px;
`

const position = {lat: -5.7793, lng: -35.2009}

const Map = (props) => {
  return (
    <MapContainer center={position} zoom={13}>
      <TileLayer
        attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`}
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}

export default Map
