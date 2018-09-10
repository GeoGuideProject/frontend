import React from "react";

import styled from "styled-components";

import { Map as LeafletMap, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

const MapContainer = styled(LeafletMap)`
  width: 100%;
  height: 100%;
`;

const Map = ({ center, children }) => {
  return (
    <MapContainer center={center} zoom={13} maxZoom={18}>
      <TileLayer
        attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`}
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup disableClusteringAtZoom={16}>
        {children}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
