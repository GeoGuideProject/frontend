import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import { Container } from "reactstrap";

import Header from "../components/Header";

const BaseLayout = ({ title, children }) => (
  <Wrapper>
    <Helmet title={title} />
    <Header />
    <Content>
      <FullContainer>{children}</FullContainer>
    </Content>
  </Wrapper>
);

const Content = styled.div`
  margin: 3rem 0;
  flex-grow: 1;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const FullContainer = styled(Container)`
  height: 100%;
`;

export default BaseLayout;
