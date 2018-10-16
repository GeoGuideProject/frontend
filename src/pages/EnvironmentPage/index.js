import React, { Component } from "react";
import styled from "styled-components";
import { csv, median, max } from "d3";
import * as crossfilter from "crossfilter2";

import * as api from "../../api";
import Map from "../../components/Map";
import { MenuControl } from "../../components/Controls";

import Filter from "./Filter";

import "react-vis/dist/style.css";

const normalFillColor = "#2196F3";
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
    dataset: [],
    filters: {}
  };

  handleFilter = () => {
    this.setState(({ dataset }) => ({
      data: dataset.allFiltered()
    }));
  };

  handleChange = key => event => {
    const { data } = this.state;
    const { value } = event.target;
    const maxValue = max(data, d => {
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
      return normalFillColor;
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
          const cf = crossfilter(dataset);

          this.setState({
            meta: data,
            loading: false,
            center: {
              lat: median(dataset, d => d[data.latitudeAttr]),
              lng: median(dataset, d => d[data.longitudeAttr])
            },
            dataset: cf,
            data: cf.allFiltered()
          });
        }
      );
    });
  }

  componentWillUnmount() {
    const { dataset } = this.state;
    if (!!dataset) {
      dataset.remove();
    }
  }

  render() {
    const {
      loading,
      center,
      dataset,
      data,
      meta,
      colorModifier,
      sizeModifier
    } = this.state;

    if (loading) {
      return "Loading...";
    }

    const numericAttributes = meta.attributes.filter(a => a.type === "number");

    return (
      <Wrapper>
        <FilterContainer>
          <Filter
            onFilter={this.handleFilter}
            dataset={dataset}
            attributes={numericAttributes
              .slice(0, 2)
              .map(attr => attr.description)}
          />
        </FilterContainer>
        <MapContainer>
          <MenuControl
            attributes={numericAttributes}
            currentColor={colorModifier}
            onColorChange={this.handleChange("colorModifier")}
            currentSize={sizeModifier}
            onSizeChange={this.handleChange("sizeModifier")}
          />
          {/* <FilterControl
          attributes={meta.attributes.filter(a => a.type === "number")}
        /> */}
          <Map
            center={center}
            dataset={data}
            getColor={this.getColor}
            getSize={this.getSize}
            latitudeSelector={p => p[meta.latitudeAttr]}
            longitudeSelector={p => p[meta.longitudeAttr]}
          />
        </MapContainer>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
`;

const FilterContainer = styled.div`
  width: 20vw;
  height: 100vh;
  overflow-y: auto;
  padding: 1rem;
`;

const MapContainer = styled.div`
  flex-grow: 1;
  height: 100vh;
`;
