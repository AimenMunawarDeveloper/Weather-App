import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Modal,
  ListGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  findCardBackground,
  getCurrentTime,
  getCurrentDate,
  checkAirQuality,
} from "./DisplayWeather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export const DisplayWeatherCards = ({ weatherData }) => {
  const airQualityIndex = weatherData.current.air_quality["us-epa-index"];
  const airQualityText = checkAirQuality(airQualityIndex);
  const showAlert = [3, 4, 5, 6].includes(airQualityIndex);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const backgroundImage = weatherData.current.condition.text
    ? findCardBackground(weatherData.current.condition.text)
    : "";

  const handleShowModal = () => {
    console.log("Button clicked, showing modal");
    setShowAlertModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setShowAlertModal(false);
  };

  console.log(weatherData.alerts.alert);

  return (
    <Col>
      <Card
        className="text-center mb-4 position-relative"
        style={{ width: "18rem" }}
      >
        <div
          className="bg-image position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            zIndex: 0,
          }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            zIndex: 1,
          }}
        />
        <Card.Body className="position-relative" style={{ zIndex: 2 }}>
          <Card.Text>
            {getCurrentTime()} &nbsp; {getCurrentDate()}
          </Card.Text>
          <Card.Title>Weather in {weatherData.location.name}</Card.Title>
          <h3>
            <img
              src={`${weatherData.current.condition.icon}`}
              alt="current weather icon"
            />
            {weatherData.current.temp_c}
            <sup>°c</sup>
          </h3>
          {weatherData.alerts.alert && weatherData.alerts.alert.length > 0 && (
            <OverlayTrigger
              overlay={<Tooltip>Click to see weather alerts!</Tooltip>}
            >
              <FontAwesomeIcon
                icon={faBell}
                onClick={handleShowModal}
                style={{ color: "red", cursor: "pointer" }}
              />
            </OverlayTrigger>
          )}
          <Card.Text>
            <strong>{weatherData.current.condition.text}</strong>
          </Card.Text>
          <Card.Text style={showAlert ? { color: "red" } : {}}>
            <strong>Air Quality: </strong>
            {airQualityText}
          </Card.Text>
          <Card.Text>
            <strong>Wind Speed</strong> &nbsp; <strong>Humidity</strong> <br />
          </Card.Text>
          <Card.Text>
            {weatherData.current.wind_mph} mph &nbsp; &nbsp; &nbsp;{" "}
            {weatherData.current.humidity}%
          </Card.Text>
        </Card.Body>
      </Card>

      {weatherData.alerts.alert && (
        <Modal show={showAlertModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Weather Alerts</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              {weatherData.alerts.alert.map((alert, index) => (
                <ListGroup.Item
                  key={index}
                  variant="danger"
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  <h5>{alert.headline}</h5>
                  <p>{alert.description}</p>
                  <small className="text-muted">
                    Effective from: {new Date(alert.effective).toLocaleString()}{" "}
                    - Expiration: {new Date(alert.expires).toLocaleString()}
                  </small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Col>
  );
};
