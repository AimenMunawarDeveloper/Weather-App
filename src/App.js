import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DisplayWeather } from "./pages/Weather/components/DisplayWeather";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DisplayWeather />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
