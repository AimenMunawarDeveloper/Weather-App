import { Container, Card, Row, Col } from "react-bootstrap";
import { LineChart } from "./TemperatureChart";
import { formatedForcastTime } from "./DisplayWeather";
import { useState, useEffect } from "react";
import { getCurrentTime } from "./DisplayWeather";

export const Forecast = ({ weather }) => {
  const [showHourly, setShowHourly] = useState({});
  const [currentHour, setCurrentHour] = useState(getCurrentTime().slice(0, 2));
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(getCurrentTime().slice(0, 2));
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  const handleHourlyData = (date) => {
    setShowHourly((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };
  return (
    <>
      <h3 className="text-center m-4">
        Forecasted Weather in {weather.location.name}
      </h3>
      <Container>
        {(() => {
          const maxTemperatures = weather.forecast.forecastday.map(
            (day) => day.day.maxtemp_c
          );
          const dates = weather.forecast.forecastday.map((day) => day.date);
          return (
            <div>
              <Row className="justify-content-center mb-4">
                <Col md={8}>
                  <LineChart temperatureData={maxTemperatures} labels={dates} />
                </Col>
              </Row>

              <Row className="justify-content-center mb-4">
                {weather.forecast.forecastday.map((day) => (
                  <Col key={day.date} md={3}>
                    <Card
                      className="mb-3"
                      onClick={() => handleHourlyData(day.date)}
                      style={{
                        boxShadow: "7px 7px 5px rgba(0, 0, 0.5)",
                      }}
                    >
                      <Card.Body className="text-center">
                        <Card.Title>{formatDate(day.date)}</Card.Title>
                        <img
                          src={`${day.day.condition.icon}`}
                          alt="daily condition icon"
                        />
                        <Card.Text>{day.day.avgtemp_c}°C</Card.Text>
                        <Card.Text>
                          Condition: {day.day.condition.text}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {weather.forecast.forecastday.map(
                (day) =>
                  showHourly[day.date] && (
                    <Row key={day.date} className="mt-3">
                      {day.hour.length > 0 ? (
                        <>
                          {day.hour.map((eachHour) => {
                            const formattedHour = formatedForcastTime(
                              eachHour.time_epoch
                            ).slice(0, 2);
                            const isCurrentHour = formattedHour === currentHour;
                            return (
                              <Col key={eachHour.time_epoch} xs={12} md={2}>
                                <Card
                                  className="mb-3 p-3"
                                  style={{
                                    boxShadow: "7px 7px 5px rgba(0, 0, 0.5)",
                                    backgroundColor: isCurrentHour
                                      ? "#9AC9E6"
                                      : "none",
                                  }}
                                >
                                  <div className="text-center">
                                    {formatedForcastTime(eachHour.time_epoch)}
                                    <br />
                                    <img
                                      src={`${eachHour.condition.icon}`}
                                      alt="hourly temperature icon"
                                    />
                                    <br />
                                    {eachHour.temp_c}°C <br />
                                  </div>
                                </Card>
                              </Col>
                            );
                          })}
                        </>
                      ) : (
                        <Col xs={12} className="text-center">
                          <p>No hourly data available.</p>
                        </Col>
                      )}
                    </Row>
                  )
              )}
            </div>
          );
        })()}
      </Container>
    </>
  );
};
