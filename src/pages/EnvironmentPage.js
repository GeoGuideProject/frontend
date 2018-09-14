import React, { Component } from "react";
import styled from "styled-components";

import { csv, median } from "d3";

import Map from "../components/Map";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default class EnvironmentPage extends Component {
  state = { loading: true, center: {}, dataset: [] };

  componentDidMount() {
    const {
      match: {
        params: { datasetId }
      }
    } = this.props;

    csv(`http://localhost:5000/_uploads/datasets/${datasetId}.csv`).then(
      dataset => {
        this.setState({
          loading: false,
          center: {
            lat: median(dataset, d => d["latitude"]),
            lng: median(dataset, d => d["longitude"])
          },
          dataset
        });
      }
    );
  }

  render() {
    const { loading, center, dataset } = this.state;

    if (loading) {
      return "Loading...";
    }

    return (
      <Container>
        <Map
          center={center}
          dataset={dataset}
          latitudeSelector={p => p.latitude}
          longitudeSelector={p => p.longitude}
        />
      </Container>
    );
  }
}
