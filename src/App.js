import logo from './logo.svg';
import './App.css';
import {Home} from './Home';
import {Comp} from './Comp';
import {BrowserRouter, Route,NavLink} from 'react-router-dom';
import { Switch } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">
      client       </h3>
        
      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <ul className="navbar-nav">
          
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/comp">
            Comp
            </NavLink>
          </li>
          
        </ul>
      </nav>

      <Switch>
        <Route path='/home' component={Home}/>
        <Route path='/comp' component={Comp}/>
      </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;