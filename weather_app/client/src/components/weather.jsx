import React, { Component } from 'react';

class Weather extends Component {
  constructor() {
  }

  render() {
    return (
      <div className="row">
        <div className="col-3">
          <span className="">15 C , LAGOS NIGERIA</span>
        </div>
        <div className="col">
          <button onClick={() => this.props.onDelete()} className="m-2 btn btn-danger btn-sm">Delete</button>
        </div>
      </div >
    );
  }
}

export default Weather;