import React from "react";
import styled from "styled-components";

import BaseLayout from "../layouts/BaseLayout";
import { AuthContext } from "../contexts/auth";

import { Form, FormGroup, Input, Label, Button, Col, Alert } from "reactstrap";

import { Link, Redirect } from "react-router-dom";

import * as api from "../api";

export default class LoginPage extends React.Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  handleChange = key => e => {
    const { value } = e.target;
    this.setState(() => ({
      [key]: value
    }));
  };

  handleSubmit = onLogin => e => {
    e.preventDefault();

    const { email, password } = this.state;

    if (email === "" || password === "") {
      this.setState(() => ({
        error: "Email and password are required."
      }));
      return;
    }

    api.token({ email, password }).then(
      ({ data }) => {
        onLogin(data);
      },
      () => {
        this.setState(() => ({
          error: "The credentials could not be validated."
        }));
      }
    );
  };

  render() {
    const { email, password, error } = this.state;

    return (
      <BaseLayout>
        <h1>Please login</h1>

        {!!error ? <Alert color="danger">{error}</Alert> : null}

        <Col md={4}>
          <AuthContext.Consumer>
            {({ isAuthenticated, onLogin }) => {
              if (isAuthenticated) {
                const { from } = this.props.location.state || {
                  from: { pathname: "/" }
                };
                return <Redirect to={from} />;
              }

              return (
                <Form onSubmit={this.handleSubmit(onLogin)}>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={this.handleChange("email")}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={this.handleChange("password")}
                    />
                  </FormGroup>

                  <Button color={"success"}>Sign In!</Button>

                  <P>
                    Need to <Link to="/register">Register</Link>?
                  </P>
                </Form>
              );
            }}
          </AuthContext.Consumer>
        </Col>
      </BaseLayout>
    );
  }
}

const P = styled.p`
  margin-top: 2rem;
`;
