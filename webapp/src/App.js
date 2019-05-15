import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { Route, Switch } from "react-router-dom";

import MainPageContainer from "common/screens/MainPage/MainPageContainer";
import RedirectPageContainer from "auth/screens/RedirectPage/RedirectPageContainer";
import LoginPageContainer from "auth/screens/LoginPage/LoginPageContainer";
import * as routes from "routes";
import * as loginRoutes from "auth/routes";
import { infoMessage } from "common/utils/logs";

const NoMatch = ({ location }) => (
  <div>
    <h3>
      404 - No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

NoMatch.propTypes = {
  location: PropTypes.object
};

class App extends Component {
  render() {
    infoMessage("Application loaded");
    return (
      <Switch>
        <Route
          exact={true}
          path={routes.mainRoute.path}
          component={MainPageContainer}
        />
        <Route
          path={loginRoutes.redirectRoute.path}
          component={RedirectPageContainer}
        />
        <Route
          path={loginRoutes.loginRoute.path}
          component={LoginPageContainer}
        />
      </Switch>
    );
  }
}

export default translate("translations")(App);
