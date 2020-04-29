import React, { Component } from 'react';

class Buttons extends Component {
  state = {}
  render() {
    return (
      <React.Fragment>
        <input type="submit" value="Submit" className="btn btn-primary" onClick="" />
        <a className="btn btn-secondary ">Add Location</a>
      </React.Fragment>
    );
  }
}

export default Buttons;
