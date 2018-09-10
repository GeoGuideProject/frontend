import React from "react";
import styled from "styled-components";
import { CircleMarker, Popup } from "react-leaflet";
import { Button } from "reactstrap";

const Profile = styled.div`
  max-height: 25em;
  overflow-y: auto;
  padding-bottom: 1em;
`;

export default ({ position, attributes }) => {
  return (
    <CircleMarker
      center={position}
      stroke={false}
      fillOpacity={0.75}
      radius={7}
      fillColor="#2196F3"
    >
      <Popup>
        <h4>Profile</h4>

        <Profile>
          {Object.keys(attributes).map(attribute => {
            if (!attributes[attribute] || attribute === "geoguide_id") {
              return null;
            }

            let value = attributes[attribute];

            if (Number(value)) {
              const number = Number(value);
              value = Number.isInteger(number)
                ? number.toString()
                : parseFloat(Number(value).toFixed(5)).toString();
            }

            return (
              <React.Fragment key={attribute}>
                <span>
                  <strong>{attribute}</strong>: <code>{value}</code>
                </span>
                <br />
              </React.Fragment>
            );
          })}
        </Profile>

        <Button>Highlight</Button>
      </Popup>
    </CircleMarker>
  );
};
