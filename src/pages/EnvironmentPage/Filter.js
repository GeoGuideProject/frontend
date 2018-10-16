import React, { Component } from "react";
import { scaleLinear, max, min } from "d3";
import debounce from "lodash.debounce";
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

    const { dataset, attributes } = this.props;

    const data = {};
    const dimension = {};
    const selection = {};
    const allData = dataset.all();

    attributes.forEach(attribute => {
      dimension[attribute] = dataset.dimension(d => Number(d[attribute]));

      console.log(dimension[attribute].top(5));

      const dataMax = max(allData, d => Number(d[attribute]));
      const dataMin = min(allData, d => Number(d[attribute]));

      const group = dimension[attribute].group();

      const scaleX = scaleLinear()
        .domain([dataMin - dataMin / 10, dataMax + dataMax / 10])
        .rangeRound([0, 275]);

      const scaleY = scaleLinear()
        .domain([0, group.top(1)[0].value])
        .rangeRound([0, 100]);

      data[attribute] = group.all().map(d => ({
        x: scaleX(d.key),
        y: scaleY(d.value)
      }));
    });

    console.log(data);

    this.state = {
      selection,
      dimension,
      data
    };
  }

  handleFilterSelection = attribute =>
    debounce(area => {
      const { onFilter } = this.props;
      this.setState(({ dimension, selection }) => {
        const start = area ? area.left : null;
        const end = area ? area.right : null;
        const prevDimension = dimension[attribute];

        return {
          selection: {
            ...selection,
            [attribute]: {
              start,
              end
            }
          },
          dimension: {
            ...dimension,
            [attribute]:
              start === null || end === null
                ? dimension[attribute].filterAll()
                : prevDimension.filter([start, end])
          }
        };
      }, onFilter);
    }, 300);

  componentWillUnmount = () => {
    const { dimension } = this.state;
    Object.keys(dimension).forEach(attribute => dimension[attribute].dispose());
  };

  render = () => {
    const { attributes } = this.props;
    const { selection, data } = this.state;

    return (
      <React.Fragment>
        {attributes.map((attribute, index) => {
          const { start, end } = selection[attribute] || {
            start: null,
            end: null
          };

          const handleSelection = this.handleFilterSelection(attribute);

          return (
            <div key={index}>
              <h6>
                <code>{attribute}</code>
              </h6>

              <XYPlot height={300} width={300}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalBarSeries
                  data={data[attribute]}
                  colorType="literal"
                  getColor={d => {
                    if (start === null || end === null) {
                      return "#1E96BE";
                    }

                    const inX = d.x >= start && d.x <= end;
                    const inX0 = d.x0 >= start && d.x0 <= end;
                    const inStart = start >= d.x0 && start <= d.x;
                    const inEnd = end >= d.x0 && end <= d.x;

                    return inStart || inEnd || inX || inX0
                      ? "#12939A"
                      : "#1E96BE";
                  }}
                />
                <Highlight
                  color="#829AE3"
                  drag
                  enableY={false}
                  onDrag={handleSelection}
                  onDragEnd={handleSelection}
                />
              </XYPlot>
            </div>
          );
        })}
      </React.Fragment>
    );
  };
}
