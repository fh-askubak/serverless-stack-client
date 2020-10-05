import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';

export default () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      {/* Catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}