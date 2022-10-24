import "./styles.css";
import Stopwatch from "./Stopwatch";
export default function App() {
  return (
    <div className="App">
      <h3 style={{ Top: 0 }}> Countdown Timer </h3>
      <div className="appContainer">
        <Stopwatch />
      </div>
    </div>
  );
}
