import React from "react";

import styled from "styled-components";

import {
  Map as LeafletMap,
  TileLayer,
  LayersControl,
  FeatureGroup
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import HeatmapLayer from "react-leaflet-heatmap-layer";

import Marker from "./Marker";

const MapContainer = styled(LeafletMap)`
  width: 100%;
  height: 100%;
`;

const Map = ({ center, dataset, latitudeSelector, longitudeSelector }) => {
  return (
    <MapContainer center={center} zoom={13} maxZoom={18}>
      <LayersControl>
        <LayersControl.BaseLayer name="Grayscale">
          <TileLayer
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Street" checked>
          <TileLayer
            attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`}
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay name="Heatmap">
          <FeatureGroup color="purple">
            <HeatmapLayer
              fitBoundsOnLoad
              fitBoundsOnUpdate
              points={dataset}
              longitudeExtractor={longitudeSelector}
              latitudeExtractor={latitudeSelector}
              intensityExtractor={() => 1}
            />
          </FeatureGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Dataset" checked>
          <FeatureGroup color="purple">
            <MarkerClusterGroup disableClusteringAtZoom={16}>
              {dataset.map(point => (
                <Marker
                  key={point["geoguide_id"]}
                  attributes={point}
                  position={{
                    lat: latitudeSelector(point),
                    lng: longitudeSelector(point)
                  }}
                />
              ))}
            </MarkerClusterGroup>
          </FeatureGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};

export default Map;
