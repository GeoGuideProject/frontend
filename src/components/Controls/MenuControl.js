import React, { Component } from "react";
import { FormGroup, Label, Input } from "reactstrap";

import { Wrapper, Title, Container, POSITION } from "./index";

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
      <Wrapper position={POSITION.TOP_LEFT}>
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
