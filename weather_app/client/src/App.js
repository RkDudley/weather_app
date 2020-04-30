import React, { Component } from 'react';
import './App.css';
import Weathers from "./components/weathers";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  state = {
    weathers: []
  }

  render() {
    return (
      <React.Fragment>
      <div className ="wrapper">
      <div className="container" >
          <Weathers weathers={this.state.weathers}
          />
        </div>       
      </div>   
      </React.Fragment>
    );
  }
}

export default App;
