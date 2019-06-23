import React from 'react';
import { Route,Switch } from 'react-router-dom';

import Admin from './pages/admin';
import Login from './pages/login';


export default function App () {
    return <Switch>
      <Route path='/admin' component={Admin}/>
      <Route path='/' component={Login}/>
    </Switch>;
}