import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import React from "react";

import login from "./pages/user-login";
import signup from "./pages/user-signup";
import home from "./pages/home";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#E5B57D",
      main: "#F98600",
      dark: "#3B4F52",
      contrastText: "#fff",
      white: "#fff",
    },
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/user-login" component={login} />
          <Route exact path="/user-signup" component={signup} />
          <Route exact path="/" component={home} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}
export default App;
