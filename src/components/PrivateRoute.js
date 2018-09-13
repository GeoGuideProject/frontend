import React from "react";

import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../contexts/auth";

export default ({ component: Component, ...rest }) => {
  return (
    <AuthContext.Consumer>
      {({ isAuthenticated }) => (
        <Route
          {...rest}
          render={props =>
            isAuthenticated ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{ pathname: "/login", state: { from: props.location } }}
              />
            )
          }
        />
      )}
    </AuthContext.Consumer>
  );
};
