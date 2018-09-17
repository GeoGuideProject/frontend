import React, { Component } from "react";
import * as api from "../api";
import { AuthContext } from "../contexts/auth";

import { AUTH_KEY } from "../constants";

const initialState = {
  loading: true,
  isAuthenticated: false,
  currentUser: {}
};

export default class AuthContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { ...initialState };
  }

  onLogin = ({ accessToken }) => {
    localStorage.setItem(AUTH_KEY, accessToken);
    api.me().then(
      ({ data }) => {
        this.setState(
          () => ({
            loading: false,
            isAuthenticated: true,
            currentUser: data
          }),
          () => {
            this.onRefreshLater();
          }
        );
      },
      () => {
        this.setState(() => ({
          loading: false
        }));
      }
    );
  };

  onRefresh = () => {
    const token = localStorage.getItem(AUTH_KEY);
    api.tokenRefresh({ token }).then(
      ({ data }) => {
        localStorage.setItem(AUTH_KEY, data.accessToken);
        this.onRefreshLater();
      },
      () => {
        this.setState(() => ({
          isAuthenticated: false
        }));
      }
    );
  };

  onRefreshLater = () => {
    setTimeout(() => {
      this.onRefresh();
    }, 60 * 1000);
  };

  onLogout = () => {
    this.setState({ ...initialState }, () => {
      localStorage.clear();
    });
  };

  componentDidMount() {
    const token = localStorage.getItem(AUTH_KEY);
    this.onLogin({ accessToken: token });
  }

  render() {
    const { loading, isAuthenticated, currentUser } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

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
