import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import AuthContainer from "./containers/AuthContainer";

import PrivateRoute from "./components/PrivateRoute";

import EnvironmentPage from "./pages/EnvironmentPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

export default () => {
  return (
    <AuthContainer>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={DashboardPage} />
          <PrivateRoute
            path="/environment/:datasetId"
            component={EnvironmentPage}
          />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </AuthContainer>
  );
};
