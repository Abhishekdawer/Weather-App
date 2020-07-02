import React from 'react';
import './App.css';
import Weather from "./components/weather.components";
import "bootstrap/dist/css/bootstrap.min.css";
import "weather-icons/css/weather-icons.css";
import Form from "./components/form.component";



const Api_key = "04af77a3c930d5390d0c17bbb898dcaf";
// api call api.openweathermap.org/data/2.5/weather?q=London,uk


class App extends React.Component{
  constructor(){
    super();
    this.state= {
      city: undefined,
      country:undefined,
      icon:undefined,
      main:undefined,
      celsius:undefined,
      temp_max:undefined,
      temp_min: undefined,
      description:"",
      error:false
    };

    this.weatherIcon = {
      Thunderstorm : "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog" 
    };
  }

  get_WeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId < 232:
        this.setState({ icon: icons.Thunderstorm });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: icons.Drizzle });
        break;
      case rangeId >= 500 && rangeId <= 521:
        this.setState({ icon: icons.Rain });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: icons.Snow });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: icons.Atmosphere });
        break;
      case rangeId === 800:
        this.setState({ icon: icons.Clear });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: icons.Clouds });
        break;
      default:
        this.setState({ icon: icons.Clouds });
    }
  }


  calCelsius(temp){
    let cels = Math.floor(temp - 273.15);
    return cels;
  }

  getWeather = async (e) =>{
    e.preventDefault();

    
    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;

    if (country && city) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${Api_key}`
      );

      const response = await api_call.json();

      this.setState({
        city: `${response.name}, ${response.sys.country}`,
        country: response.sys.country,
        main: response.weather[0].main,
        celsius: this.calCelsius(response.main.temp),
        temp_min: this.calCelsius(response.main.temp_min),
        temp_max: this.calCelsius(response.main.temp_max),
        description: response.weather[0].description,
        error: false
      });

      // seting icons
      this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);

      console.log(response);
    } else {
      this.setState({
        error: true
      });
    }
  };


  render(){
    return(
    <div className="App">
    <Form loadweather={this.getWeather} error={this.state.error} />
    <Weather
     city={this.state.city}
      temp_celsius = {this.state.celsius}
      temp_max ={this.state.temp_max}
      temp_min = {this.state.temp_min}
      description ={this.state.description}
      weatherIcon = {this.state.icon}
      />
    </div>
    );
  }
}




export default App;
