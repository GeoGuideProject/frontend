import React, { Component } from "react";
import styled from "styled-components";
import { Collapse, FormGroup, Label, Input } from "reactstrap";

export default class MenuControl extends Component {
  state = { isOpen: false };

  handleToggle = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }));
  };

  render() {
    const { isOpen } = this.state;
    const {
      attributes,
      currentColor,
      onColorChange,
      currentSize,
      onSizeChange
    } = this.props;

    return (
      <Wrapper>
        <Title onClick={this.handleToggle}>
          <i className="fas fa-cog" />
        </Title>

        <Container isOpen={isOpen}>
          <FormGroup>
            <Label>Color modifier</Label>
            <Input type="select" value={currentColor} onChange={onColorChange}>
              <option value="">None</option>
              {attributes.map((attribute, index) => (
                <option key={index} value={attribute.description}>
                  {attribute.description}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Size modifier</Label>
            <Input type="select" value={currentSize} onChange={onSizeChange}>
              <option value="">None</option>
              {attributes.map((attribute, index) => (
                <option key={index} value={attribute.description}>
                  {attribute.description}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Container>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;

  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  border: 2px solid #fff;
  border-radius: 3px;

  padding: 0 5px;
`;

const Title = styled.div`
  margin-top: 0;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
`;

const Container = styled(Collapse)`
  width: 15rem;
`;
