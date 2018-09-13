import React, { Component } from "react";
import * as api from "../api";
import { AuthContext } from "../contexts/auth";

import { AUTH_KEY } from "../constants";

const initialState = {
  isAuthenticated: false,
  currentUser: {}
};

export default class AuthContainer extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem(AUTH_KEY);
    this.onLogin({ accessToken: token });

    this.state = { ...initialState };
  }

  onLogin = ({ accessToken }) => {
    localStorage.setItem(AUTH_KEY, accessToken);
    api.me().then(({ data }) => {
      this.setState(() => ({
        isAuthenticated: true,
        currentUser: data
      }));
    });
  };

  onLogout = () => {
    this.setState({ ...initialState }, () => {
      localStorage.clear();
    });
  };

  render() {
    const { isAuthenticated, currentUser } = this.state;

    return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          currentUser,
          onLogout: this.onLogout,
          onLogin: this.onLogin
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
