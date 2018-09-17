import React from "react";
import styled from "styled-components";

import BaseLayout from "../layouts/BaseLayout";
import { AuthContext } from "../contexts/auth";

import { Form, FormGroup, Input, Label, Button, Col, Alert } from "reactstrap";

import { Link, Redirect } from "react-router-dom";

import * as api from "../api";

export default class RegisterPage extends React.Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
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

    const { email, password, confirmPassword } = this.state;

    if (email === "" || password === "") {
      this.setState(() => ({
        error: "Email and password are required."
      }));
      return;
    }

    if (password !== confirmPassword) {
      this.setState(() => ({
        error: "The password and its confirmation are not the same."
      }));
      return;
    }

    api.register({ email, password, confirmPassword }).then(
      () => {
        api.token({ email, password }).then(({ data }) => {
          onLogin(data);
        });
      },
      () => {
        this.setState(() => ({
          error: "This email is already being used."
        }));
      }
    );
  };

  render() {
    const { email, password, confirmPassword, error } = this.state;

    return (
      <BaseLayout title="Register">
        <h1>Please register</h1>

        {!!error ? <Alert color="danger">{error}</Alert> : null}

        <Col md={4}>
          <AuthContext.Consumer>
            {({ isAuthenticated, onLogin }) => {
              if (isAuthenticated) {
                return <Redirect to={"/"} />;
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
                  <FormGroup>
                    <Label>Confirm</Label>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={this.handleChange("confirmPassword")}
                    />
                  </FormGroup>

                  <Button color={"success"}>Register!</Button>

                  <P>
                    Already have an account? <Link to="/login">Login</Link>
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
