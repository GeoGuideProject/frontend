import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import { Container } from "reactstrap";

import Header from "../components/Header";

const BaseLayout = ({ title, children }) => (
  <div>
    <Helmet title={title} />
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
