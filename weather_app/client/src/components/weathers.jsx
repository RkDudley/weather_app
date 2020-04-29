import React, { Component } from 'react';
import Weather from './weather';
import axios from 'axios';

class Weathers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_value: '',
      weathers: [],
      setWeather: {}

    }

    this.onChangeSearchValue = this.onChangeSearchValue.bind(this);
  }

  onChangeSearchValue = (e) => {
    this.setState({
      search_value: e.target.value
    });
  }


  onSubmit = (e) => {
    e.preventDefault();

    console.log(`Form submitted:`);
    console.log(`Search : ${this.state.search_value}`);
    this.handleSearch(this.state.search_value);
  }

  onAdd = (e) => {
    e.preventDefault();
    this.handleAdd(this.state.search_value);
  }


  getWeathers() {
    axios.get(`http://localhost:9001/weathers/saved`)
      .then(res => {
        const weathers = res.data;

        console.log('Saved Weathers', weathers);
        this.setState({ weathers });


      })

  }

  handleEdit(e, value) {
    e.preventDefault();
    var test = prompt("Edit Location");

    if (test.length < 2) {
      alert('Invalid Location');
      return;
    }
    const location = value;


    axios.post(`http://localhost:9001/weathers/edit`, {
      'location': location,
      'replacement': test

    })
      .then(res => {

        console.log('Sent For Update: ', res.data);
      })
      .catch(err => console.log('React ERROR:', err));
  }


  handleDelete(e, value) {
    e.preventDefault();
    const location = value;


    console.log('Location to send', location);
    axios.post(`http://localhost:9001/weathers/delete`, {
      data: location
    })
      .then(res => {

        console.log('Sent TO Sevrer FOR DELETE', res);
        this.getWeathers();
      })
      .catch(err => console.log(err));
  }


  handleAdd(e) {
    let location = e;

    if (location === "") {
      alert("Location cannot be empty");
    }
    axios.post(`http://localhost:9001/weathers/`, {
      'location': location
    })
      .then(res => {

        console.log('Sent TO Sevrer', res.data);
        this.getWeathers();
      })
      .catch(err => console.log(err));

  }
  handleSearch(e) {
    console.log('Handle Search:', e);

    axios.get(`http://localhost:9001/weathers/` + e)
      .then(res => {
        const weather = res.data;
        console.log('Weather', weather);
        this.setState({ setWeather: weather });
      })
      .catch(err => console.log('Error', err));


  }
  componentDidMount() {
    this.getWeathers();
  }


  render() {
    const weathers = this.state.weathers;
    return (

      <div>
        <div className={(typeof this.state.setWeather != undefined) ? ((this.state.setWeather.temp > 16) ? 'app warm' : 'app') : 'app'}>

          <main>
            <div className="search-box ">

              <form onSubmit={this.onSubmit}>

                <div className="form-group">
                  <input type="text" className="search-bar" placeholder="Enter City, State or ZipCode.."
                    value={this.state.search_value}
                    onChange={this.onChangeSearchValue} />
                </div>
                <div className="form-group text-center">
                  <input type="submit" value="Submit" className="btn btn-primary mr-3" />
                  <a className="btn btn-secondary text-white" onClick={this.onAdd}>Add Location</a>
                </div>
              </form>
            </div>
            <div>
              <div className="location-box">
                <div className="location">
                  {this.state.setWeather.city}, {this.state.setWeather.country}
                </div>
                <div className="date"></div>
                <div className="weather-box">
                  <div className="temp">{
                    (isNaN(this.state.setWeather.temp) ? "" : Math.round(this.state.setWeather.temp))
                  }°F
                  </div>
                  <div className="weather"></div>
                </div>
              </div>
            </div>
            <ul>
              {weathers.map((w, index) => {
                return <div key={index} className="row mt-3">
                  <div className="col-md-6 text-center text-white h6">{w}</div>
                  <div className="col-md-6"><a href="" className="btn btn-primary mr-3 btn-sm" onClick={(e) => { this.handleEdit(e, w) }}>
                    EDIT</a>
                    <a className="ml-3 btn btn-danger btn-sm" onClick={(e) => { this.handleDelete(e, w) }} >DELETE</a></div>

                </div>
              })}
            </ul>
          </main>
        </div>
      </div>
    );
  }
}

export default Weathers;
