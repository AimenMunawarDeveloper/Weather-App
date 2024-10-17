import { useEffect, useState } from "react";
import { FetchWeatherData } from "../api/WeatherApi";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { setKey } from "../../api-helper/api-helper";
import { Forecast } from "./DisplayForecastCards";
import { DisplayWeatherCards } from "./DisplayWeatherCards";
export const formatedForcastTime = (epochTime) => {
  const date = new Date(epochTime * 1000);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return hours + ":" + minutes;
};
export const findCardBackground = (condition) => {
  if (condition === "Sunny") {
    return "/assets/sunny.jpg";
  } else if (condition === "Light rain") {
    return "/assets/light-rain.avif";
  } else if (condition === "Partly cloudy") {
    return "/assets/partly-cloudy.jpg";
  } else if (condition === "Clear") {
    return "/assets/clear.jpg";
  } else if (condition === "Cloudy") {
    return "/assets/cloudy.jpg";
  } else if (condition === "Thunderstorm") {
    return "/assets/thunderstorm.jpg";
  } else if (condition === "Heavy rain") {
    return "/assets/heavy-rain.jpg";
  } else if (condition === "Snow") {
    return "/assets/snow.jpg";
  } else if (condition === "Fog") {
    return "/assets/fog.jpg";
  } else if (condition === "Mist") {
    return "/assets/mist.jpg";
  } else {
    return "/assets/clear.jpg";
  }
};
export const getCurrentTime = () => {
  let date = new Date();
  return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};
export const getCurrentDate = () => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
export const checkAirQuality = (index) => {
  switch (index) {
    case 1:
      return "Good";
    case 2:
      return "Moderate";
    case 3:
      return "Unhealthy for sensitive group";
    case 4:
      return "Unhealthy";
    case 5:
      return "Very Unhealthy";
    case 6:
      return "Hazardous";
    default:
      return "Unknown";
  }
};

export const DisplayWeather = () => {
  setKey();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [city, setCity] = useState("");
  const [view, setView] = useState("current");
  const [fiveDaysData, setFiveDaysData] = useState(null);
  const [showThreeDays, setShowThreeDays] = useState(false);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [distance, setDistance] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");

  const fetchWeather = async (cityName) => {
    setError(false);
    try {
      const response = await FetchWeatherData(cityName);
      setWeatherData(response);
      setFiveDaysData(false);
      setShowThreeDays(false);
    } catch (error) {
      console.error("Error:", error);
      setError(true);
    }
  };
  const fetchWeatherByUserCoordinates = async () => {
    setError(false);
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await FetchWeatherData(`${latitude},${longitude}`);
          setWeatherData(response);
        } catch (error) {
          console.error("Error fetching weather by coordinates:", error);
          setError(true);
        }
      });
    } catch (error) {
      console.error("Geolocation error:", error);
      setError(true);
    }
  };
  useEffect(() => {
    const storedCity = localStorage.getItem("city");
    if (!storedCity) {
      fetchWeatherByUserCoordinates();
    } else {
      fetchWeather(storedCity);
    }
    setCity(storedCity);
  }, []);
  useEffect(() => {
    if (weatherData && weatherData.current) {
      const condition = weatherData.current.condition.text;
      const background = findCardBackground(condition);
      setBackgroundImage(background);
    }
  }, [weatherData]);
  const handleCityChange = (e) => {
    setCity(e.target.value);
    localStorage.setItem("city", e.target.value);
  };
  const handleViewChange = (e) => {
    setView(e.target.value);
  };
  const handleLatChange = (e) => {
    setLat(e.target.value);
  };
  const handleLonChange = (e) => {
    setLon(e.target.value);
  };
  const fetch5DaysData = async () => {
    setError(false);
    try {
      const response = await FetchWeatherData(city, 5);
      setFiveDaysData(response);
    } catch (error) {
      console.error("Error:", error);
      setError(true);
    }
  };
  const display5DaysData = () => {
    fetch5DaysData();
    setShowThreeDays(false);
  };
  const display3DaysData = () => {
    setShowThreeDays(true);
    setFiveDaysData(false);
  };
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  const handleDistanceFormSubmit = (e) => {
    e.preventDefault();
    if (weatherData && weatherData.location) {
      const calculatedDistance = getDistanceFromLatLonInKm(
        parseFloat(lat),
        parseFloat(lon),
        weatherData.location.lat,
        weatherData.location.lon
      );
      setDistance(calculatedDistance);
    } else {
      alert("Weather data is not available. Please fetch weather data first.");
    }
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        // backgroundColor: "#9AC9E6",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Row className="m-4">
        <Col className="d-flex mb-4 flex-column justify-content-center align-items-center">
          <h1 className="mb-4">Weather App</h1>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              fetchWeather(city);
            }}
          >
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="e.g London"
                value={city || ""}
                onChange={handleCityChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                label="Current Weather"
                type="radio"
                value="current"
                checked={view === "current"}
                onChange={handleViewChange}
              />
              <Form.Check
                label="Forecasted Weather"
                type="radio"
                value="forecast"
                checked={view === "forecast"}
                onChange={handleViewChange}
              />
            </Form.Group>
          </Form>
        </Col>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="latInput.ControlInput1">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="text"
                value={lat || ""}
                onChange={handleLatChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="lonInput.ControlInput1">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="text"
                value={lon || ""}
                onChange={handleLonChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="text-center">
          <Col>
            <Button onClick={handleDistanceFormSubmit}>Find Distance</Button>
          </Col>
        </Row>
      </Row>
      {distance !== null && (
        <Row className="mb-4">
          <Col>
            <h2>Calculated Distance: {distance.toFixed(2)} km</h2>
          </Col>
        </Row>
      )}
      {error && <div>Error in fetching data.</div>}
      {weatherData && weatherData.location ? (
        <>
          {view === "current" && weatherData.current && (
            <>
              <Row>
                <DisplayWeatherCards weatherData={weatherData} />
              </Row>
              <Row className="mb-3">
                <Col>
                  <Button onClick={display5DaysData}>5 Days</Button>
                </Col>
                <Col>
                  <Button onClick={display3DaysData}>3 Days</Button>
                </Col>
              </Row>
              <Row className="w-100">
                <Col>{fiveDaysData && <Forecast weather={fiveDaysData} />}</Col>
              </Row>
              <Row className="w-100">
                <Col>{showThreeDays && <Forecast weather={weatherData} />}</Col>
              </Row>
            </>
          )}
          {view === "forecast" && weatherData.forecast && (
            <Forecast weather={weatherData} />
          )}
        </>
      ) : (
        <p>No weather data available.</p>
      )}
    </Container>
  );
};
