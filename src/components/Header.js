import React, { Component } from "react";

import {
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
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <AuthContext.Consumer>
                    {({ isAuthenticated, onLogout }) =>
                      isAuthenticated ? (
                        <NavLink href="#" onClick={() => onLogout()}>
                          Logout
                        </NavLink>
                      ) : (
                        <NavLink tag={Link} to="/login">
                          Login
                        </NavLink>
                      )
                    }
                  </AuthContext.Consumer>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
