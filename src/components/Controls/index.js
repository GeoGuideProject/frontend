import React from "react";
import styled from "styled-components";
import { Collapse } from "reactstrap";

export const POSITION = {
  TOP_LEFT: "tl",
  TOP_RIGHT: "tr",
  BOTTOM_LEFT: "bl",
  BOTTOM_RIGHT: "br"
};

export { default as MenuControl } from "./MenuControl";

export const Wrap = styled.div`
  position: absolute;
  z-index: 1000;

  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  border: 2px solid #fff;
  border-radius: 3px;

  padding: 0 5px;
`;

export const Wrapper = ({ position, children }) => {
  const getStyle = position => {
    switch (position) {
      case POSITION.TOP_RIGHT:
        return { top: "10px", right: "10px" };
      case POSITION.BOTTOM_LEFT:
        return { bottom: "10px", left: "calc(20vw + 10px)" };
      case POSITION.BOTTOM_RIGHT:
        return { bottom: "10px", right: "10px" };
      case POSITION.TOP_LEFT:
      default:
        return { top: "10px", left: "calc(20vw + 10px)" };
    }
  };

  return <Wrap style={getStyle(position)}>{children}</Wrap>;
};

export const Title = styled.div`
  margin-top: 0;
  font-size: 1em;
  font-weight: 700;
  cursor: pointer;
`;

export const Container = styled(Collapse)`
  width: 15rem;
`;
