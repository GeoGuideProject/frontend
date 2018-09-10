import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import EnvironmentPage from "./pages/EnvironmentPage";
import DashboardPage from "./pages/DashboardPage";

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={DashboardPage} />
        <Route path="/environment/:datasetId" component={EnvironmentPage} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
