import React, { Component } from "react";
import { scaleLinear, max, min } from "d3";
import {
  XYPlot,
  VerticalBarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  Highlight
} from "react-vis";

export default class Filter extends Component {
  constructor(props) {
    super(props);

    const { dataset, attribute } = this.props;

    const dimension = dataset.dimension(d => Number(d[attribute]));
    const allData = dataset.all();

    const dataMax = max(allData, d => Number(d[attribute]));
    const dataMin = min(allData, d => Number(d[attribute]));

    const group = dimension.group();

    const scaleX = scaleLinear()
      .domain([dataMin - dataMin / 10, dataMax + dataMax / 10])
      .rangeRound([0, 275]);
    const scaleY = scaleLinear()
      .domain([0, group.top(1)[0].value])
      .range([0, 100]);

    const data = group.all().map(d => ({
      x: scaleX(d.key),
      y: scaleY(d.value)
    }));

    this.state = {
      selectionStart: null,
      selectionEnd: null,
      dimension,
      data
    };
  }

  handleFilterSelection = area => {
    this.setState(
      ({ dimension: prevDimension }) => {
        const selectionStart = area ? area.left : null;
        const selectionEnd = area ? area.right : null;

        if (selectionStart === null || selectionEnd === null) {
          return {
            selectionStart,
            selectionEnd,
            dimension: prevDimension.filterAll()
          };
        }

        return {
          selectionStart,
          selectionEnd,
          dimension: prevDimension.filter([selectionStart, selectionEnd])
        };
      },
      () => {
        console.log(this.state.dimension.top(Infinity));
      }
    );
  };

  componentWillUnmount = () => {
    this.state.dimension.dispose();
  };

  render = () => {
    const { attribute } = this.props;
    const { selectionStart, selectionEnd, data } = this.state;

    return (
      <div>
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
            onDrag={this.handleFilterSelection}
            onDragEnd={this.handleFilterSelection}
          />
        </XYPlot>
      </div>
    );
  };
}
