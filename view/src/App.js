import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import login from "./pages/login";
import signup from "./pages/signup";
import home from "./pages/home";

import React from "react";
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={login} />
        <Route exact path="/signup" component={signup} />
        <Route exact path="/" component={home} />
      </Switch>
    </Router>
  );
}
export default App;
