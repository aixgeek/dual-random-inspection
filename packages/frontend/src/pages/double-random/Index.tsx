import { Route, Switch, Redirect } from 'react-router-dom';
import Welcome from './Welcome';
import Normal from './Normal';
import Cooperation from './Cooperation';
import NormalHistory from './history/Normal';
import CooperationHistory from './history/Cooperation';
import Result from './history/Result';

export default () => (
  <>
    <Switch>
      <Route
        path="/double-random"
        render={({ location }) => (
          <Redirect
            to={{
              pathname: '/double-random/welcome',
              state: { from: location },
            }}
          />
        )}
        exact
      />
      <Route path="/double-random/welcome" component={Welcome} exact />
      <Route path="/double-random/normal" component={Normal} exact />
      <Route path="/double-random/cooperation" component={Cooperation} exact />
      <Route path="/double-random/normalHistory" component={NormalHistory} exact />
      <Route path="/double-random/cooperationHistory" component={CooperationHistory} exact />
      <Route path="/double-random/normalHistory/:id" component={Result} exact />
      <Route path="/double-random/cooperationHistory/:id" component={Result} exact />
    </Switch>
  </>
);
