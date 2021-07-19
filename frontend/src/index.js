import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import Home from './routes/home';
import Menu from './routes/menu';
import MenuItem from './routes/menuItem';
import Reservations from './routes/reservations';
import Contact from './routes/contact';
import Navbar from './components/navbar';
import Verification from './routes/Verification';
import ForgottenPassword from './routes/ForgottenPassword';
import ValidatePassword from './routes/ValidatePassword';

import './styles.css';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers'

const initialState = {};
const middleware = [thunk];

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

const Index = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/menu/:id" component={MenuItem} />
          <Route path="/menu" component={Menu} />
          <Route path="/contacts" component={Contact} />
          <Route path="/reservations" component={Reservations} />
          <Route path="/verification" component={Verification} />
          <Route path="/reset-password" component={ForgottenPassword} />
          <Route path="/new-password" component={ValidatePassword} />
          <Route path="/" exact component={Home} />
          <Route render={() =>
            <div className="notExist">
              <h1>Ez az oldal nem létezik!</h1>
              <Link to="/"><button>Visszalépek a főoldalra</button></Link>
            </div>
          } />
        </Switch>
        <Navbar />
      </BrowserRouter>
    </Provider>
  )
}

ReactDOM.render(<Index />, document.getElementById("root"));

