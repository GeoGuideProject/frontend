import React, { Component } from "react";
import styled from "styled-components";
import { csv, median, max } from "d3";

import * as api from "../api";
import Map from "../components/Map";
import MenuControl from "../components/MenuControl";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const normalfillColor = "#2196F3";
const normalFillColors = [
  "#e3f2fd",
  "#bbdefb",
  "#90caf9",
  "#64b5f6",
  "#42a5f5",
  "#2196f3",
  "#1e88e5",
  "#1976d2",
  "#1565c0",
  "#0d47a1"
];

export default class EnvironmentPage extends Component {
  state = {
    colorModifier: "",
    sizeModifier: "",
    maxValues: {},
    loading: true,
    menu: false,
    center: {},
    meta: {},
    dataset: []
  };

  handleChange = key => event => {
    const { dataset } = this.state;
    const { value } = event.target;
    const maxValue = max(dataset, d => {
      const n = Number(d[value]);
      return n + 2 * Math.abs(n);
    });
    this.setState(({ maxValues }) => ({
      [key]: value,
      maxValues: {
        ...maxValues,
        [value]: maxValue
      }
    }));
  };

  getColor = attributes => {
    const { colorModifier, maxValues } = this.state;

    if (colorModifier === "") {
      return normalfillColor;
    }

    let n = Number(attributes[colorModifier]);
    n += 2 * Math.abs(n);

    const index = Math.floor(
      (n / maxValues[colorModifier]) * (normalFillColors.length - 1)
    );

    return normalFillColors[index];
  };

  getSize = attributes => {
    const { sizeModifier, maxValues } = this.state;

    if (sizeModifier === "") {
      return 7;
    }

    let n = Number(attributes[sizeModifier]);
    n += 2 * Math.abs(n);

    return 5 + (n / maxValues[sizeModifier]) * 6;
  };

  componentDidMount() {
    const {
      match: {
        params: { datasetId }
      }
    } = this.props;

    api.dataset(datasetId).then(({ data }) => {
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
    const {
      loading,
      center,
      dataset,
      meta,
      colorModifier,
      sizeModifier
    } = this.state;

    if (loading) {
      return "Loading...";
    }

    return (
      <Container>
        <MenuControl
          attributes={meta.attributes.filter(a => a.type === "number")}
          currentColor={colorModifier}
          onColorChange={this.handleChange("colorModifier")}
          currentSize={sizeModifier}
          onSizeChange={this.handleChange("sizeModifier")}
        />
        <Map
          center={center}
          dataset={dataset}
          getColor={this.getColor}
          getSize={this.getSize}
          latitudeSelector={p => p[meta.latitudeAttr]}
          longitudeSelector={p => p[meta.longitudeAttr]}
        />
      </Container>
    );
  }
}
