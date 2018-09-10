import React from "react";

import styled from "styled-components";

import { Map as LeafletMap, TileLayer } from "react-leaflet";

const MapContainer = styled(LeafletMap)`
  width: 100%;
  height: 100%;
`;

const Map = ({ center, children }) => {
  return (
    <MapContainer center={center} zoom={13}>
      <TileLayer
        attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`}
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

export default Map;
