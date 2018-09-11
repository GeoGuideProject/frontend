import React, { Component } from "react";
import * as api from "../api";
import AuthContainer, { AuthContext } from "../contexts/auth";

const initialState = {
  isAuthenticated: false,
  currentUser: {}
};

export default class AuthContainer extends Component {
  state = {
    ...initialState
  };

  onLogin = ({ email, password }) => {
    api.token({ email, password }).then(data => {
      console.log(data);

      api.me().then(data => {
        console.log(data);
      });
    });
  };

  onLogout = () => {
    this.setState({ ...initialState }, () => {
      localStorage.clear();
    });
  };

  render() {
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
