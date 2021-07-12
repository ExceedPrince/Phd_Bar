import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import Home from './routes/home';
import Menu from './routes/menu';
import MenuItem from './routes/menuItem';
import Reservations from './routes/reservations';
import Contact from './routes/contact';

import Navbar from './components/navbar';

import './styles.css';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import reducers from './redux/reducers'

const myMiddleware = applyMiddleware(promiseMiddleware)(createStore)

const Index = () => {
  return (
    <Provider store={myMiddleware(reducers)}>
      <BrowserRouter>
        <Switch>
          <Route path="/menu/:id" component={MenuItem} />
          <Route path="/menu" component={Menu} />
          <Route path="/contacts" component={Contact} />
          <Route path="/reservations" component={Reservations} />
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

