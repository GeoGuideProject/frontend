import React from "react";

import styled from "styled-components";

import { Container } from "reactstrap";

import Header from "../components/Header";

const BaseLayout = ({ children }) => (
  <div>
    <Header />
    <Content>
      <Container>{children}</Container>
    </Content>
  </div>
);

const Content = styled.div`
  margin-top: 3rem;
`;

export default BaseLayout;
