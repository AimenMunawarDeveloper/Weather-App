const key = localStorage.getItem("key");
export const FetchWeatherData = async (city, day = 3) => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=${day}&aqi=yes&alerts=yes`
    );
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (err) {
    throw new Error("Error in fetching data from weather api");
  }
};
