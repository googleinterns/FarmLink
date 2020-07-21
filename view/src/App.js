import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import React from 'react';

import login from './pages/login';
import signup from './pages/signup';
import home from './pages/home';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#E5B57D',
			main: '#F98600',
			dark: '#3B4F52',
			contrastText: '#fff'
		}
	}
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <div>
          <Switch>
              <Route exact path="/login" component={login}/>
              <Route exact path="/signup" component={signup}/>
              <Route exact path="/" component={home}/>
          </Switch>
        </div>
      </Router>
    </MuiThemeProvider>
  );
}
export default App;
