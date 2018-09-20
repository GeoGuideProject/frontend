import React from "react";

import styled from "styled-components";

import {
  Map as LeafletMap,
  TileLayer,
  LayersControl,
  FeatureGroup,
  ZoomControl
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import HeatmapLayer from "react-leaflet-heatmap-layer";

import Marker from "./Marker";

const MapContainer = styled(LeafletMap)`
  width: 100%;
  height: 100%;
`;

const Map = ({
  center,
  dataset,
  latitudeSelector,
  longitudeSelector,
  getColor,
  getSize
}) => {
  return (
    <MapContainer center={center} zoom={13} maxZoom={18} zoomControl={false}>
      <ZoomControl position={"bottomright"} />
      <LayersControl>
        <LayersControl.BaseLayer name="Grayscale">
          <TileLayer
            attribution={`&copy; <a href="http://osm.org/copyright";>OpenStreetMap</a> contributors`}
            url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Colorful" checked>
          <TileLayer
            attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`}
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <LayersControl>
        <LayersControl.BaseLayer name="Heatmap">
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
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Points" checked>
          <FeatureGroup color="purple">
            {/* <MarkerClusterGroup disableClusteringAtZoom={14}> */}
            {dataset.map(point => {
              const lat = latitudeSelector(point);
              const lng = longitudeSelector(point);

              return (
                <Marker
                  key={point["geoguide_id"]}
                  getSize={getSize}
                  getColor={getColor}
                  attributes={point}
                  position={{
                    lat,
                    lng
                  }}
                />
              );
            })}
            {/* </MarkerClusterGroup> */}
          </FeatureGroup>
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  );
};

export default Map;
