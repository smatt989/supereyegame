import '../styles/app.less';
import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import Home from './Home.jsx';

export default class App extends React.Component {
  render() {
    return <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home}/>
        </Switch>
      </div>
    </Router>;
  }
}

/*
function requireAuth() {
    if(!isAuthenticated()) {
        replace({
          pathname: '/login',
          state: { nextPathname: nextState.location.pathname }
        })
    }
}*/
