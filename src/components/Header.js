import React, { Component } from "react";

import {
  Button,
  Container,
  Navbar,
  NavbarBrand,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler
} from "reactstrap";

import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/auth";

export default class Header extends Component {
  state = { isOpen: false };

  handleToggle = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  render() {
    const { isOpen } = this.state;

    return (
      <header>
        <Navbar color={"primary"} dark expand="md">
          <Container>
            <NavbarBrand tag={Link} to="/">
              GeoGuide
            </NavbarBrand>
            <NavbarToggler onClick={this.handleToggle} />
            <AuthContext.Consumer>
              {({ isAuthenticated, onLogout }) => (
                <Collapse isOpen={isOpen} navbar>
                  {isAuthenticated ? (
                    <Button tag={Link} to="/upload" color="success">
                      <i className="fas fa-upload" /> Upload a dataset
                    </Button>
                  ) : null}
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      {isAuthenticated ? (
                        <NavLink href="#" onClick={() => onLogout()}>
                          Logout
                        </NavLink>
                      ) : (
                        <NavLink tag={Link} to="/login">
                          Login
                        </NavLink>
                      )}
                    </NavItem>
                  </Nav>
                </Collapse>
              )}
            </AuthContext.Consumer>
          </Container>
        </Navbar>
      </header>
    );
  }
}
