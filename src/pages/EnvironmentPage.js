import React, { Component } from "react";
import styled from "styled-components";
import { csv, median } from "d3";

import * as api from "../api";
import Map from "../components/Map";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default class EnvironmentPage extends Component {
  state = { loading: true, center: {}, meta: {}, dataset: [] };

  componentDidMount() {
    const {
      match: {
        params: { datasetId }
      }
    } = this.props;

    api.dataset(datasetId).then(({ data }) => {
      console.log(data);
      csv(`http://localhost:5000/_uploads/datasets/${data.filename}`).then(
        dataset => {
          this.setState({
            meta: data,
            loading: false,
            center: {
              lat: median(dataset, d => d[data.latitudeAttr]),
              lng: median(dataset, d => d[data.longitudeAttr])
            },
            dataset
          });
        }
      );
    });
  }

  render() {
    const { loading, center, dataset, meta } = this.state;

    if (loading) {
      return "Loading...";
    }

    return (
      <Container>
        <Map
          center={center}
          dataset={dataset}
          latitudeSelector={p => p[meta.latitudeAttr]}
          longitudeSelector={p => p[meta.longitudeAttr]}
        />
      </Container>
    );
  }
}
