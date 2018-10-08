import React, { Component } from "react";
import styled from "styled-components";
import { csv, median, max } from "d3";
import {
  XYPlot,
  VerticalBarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  Highlight
} from "react-vis";

import * as api from "../../api";
import Map from "../../components/Map";
import { MenuControl } from "../../components/Controls";

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

  handleFilterSelection = key => area => {
    this.setState(({ filters }) => ({
      filters: {
        ...filters,
        [key]: {
          selectionStart: area && area.left,
          selectionEnd: area && area.right
        }
      }
    }));
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

  renderFilter({ description: attribute }) {
    const { dataset, filters } = this.state;

    const aggregation = dataset.reduce((aggr, curr) => {
      const x = Number(curr[attribute]);

      if (Number.isNaN(x)) {
        return aggr;
      }

      return {
        ...aggr,
        [x]: 1 + (aggr[x] || 0)
      };
    }, {});

    const data = Object.keys(aggregation)
      .map(key => {
        const x = Number(key);

        return {
          x,
          y: aggregation[x]
        };
      })
      .filter(Boolean);

    return (
      <div key={attribute}>
        <h6>
          <code>{attribute}</code>
        </h6>

        <XYPlot height={300} width={300}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalBarSeries
            data={data}
            colorType="literal"
            getColor={d => {
              if (!filters[attribute]) {
                return "#1E96BE";
              }

              const { selectionStart, selectionEnd } = filters[attribute];

              if (selectionStart === null || selectionEnd === null) {
                return "#1E96BE";
              }

              const inX = d.x >= selectionStart && d.x <= selectionEnd;
              const inX0 = d.x0 >= selectionStart && d.x0 <= selectionEnd;
              const inStart = selectionStart >= d.x0 && selectionStart <= d.x;
              const inEnd = selectionEnd >= d.x0 && selectionEnd <= d.x;

              return inStart || inEnd || inX || inX0 ? "#12939A" : "#1E96BE";
            }}
          />
          <Highlight
            color="#829AE3"
            drag
            enableY={false}
            onDrag={this.handleFilterSelection(attribute)}
            onDragEnd={this.handleFilterSelection(attribute)}
          />
        </XYPlot>
      </div>
    );
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

    const numericAttributes = meta.attributes.filter(a => a.type === "number");

    return (
      <Wrapper>
        <FilterContainer>
          {numericAttributes.map(attr => this.renderFilter(attr))}
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
            dataset={dataset}
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
