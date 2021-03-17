import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import StartStep from './start/Step';
import CooperationStep from './cooperation/Step';
import List from './history/List';
import Result from './history/Result';
import Open from './open/Open';

export default (): React.ReactNode => (
  <>
    <Switch>
      <Route
        path="/double-random"
        render={({ location }) => (
          <Redirect
            to={{
              pathname: '/double-random/start',
              state: { from: location },
            }}
          />
        )}
        exact
      />
      <Route path="/double-random/start" component={StartStep} exact />
      <Route path="/double-random/cooperation" component={CooperationStep} exact />
      <Route path="/double-random/history" component={List} exact />
      <Route path="/double-random/history/:id" component={Result} exact />
      <Route path="/double-random/open" component={Open} exact />
    </Switch>
  </>
);
