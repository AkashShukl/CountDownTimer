import { useEffect, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import audio from "./beep.mp3";

const playAlert = (time: number): void => {
  let aud = new Audio(audio);
  setTimeout(() => aud.play(), time * 1000);
};

const start = "start";
const pause = "pause";

interface TwoDigit {
  digit1: number;
  digit2: number;
}

function formatDigit(num: number): TwoDigit {
  let res: TwoDigit = {
    digit1: Math.floor(num / 10),
    digit2: num % 10
  };
  return res;
}

export default function Stopwatch(): React.ReactElement {
  const initialDigits: TwoDigit = { digit1: 0, digit2: 0 };
  const [message, setMessage] = useState<string | null>(null);
  const [watchState, setWatchState] = useState<string>(pause);
  const [minute, setMinute] = useState<TwoDigit>({
    ...initialDigits,
    digit2: 1
  });
  const [second, setSecond] = useState<TwoDigit>(initialDigits);
  const [totalRemainingSeconds, setTotalRemainingSecconds] = useState<number>(
    0
  );

  function showMessage(condition: string | null) {
    if (condition === "success") {
      setMessage("🎊🎊 Timer Completed! 🎊🎊");
    } else {
      setMessage(null);
    }
  }
  // syntehtic event
  function changeHandle(e: any): void {
    const name: string = e.target.name;
    const value: number = e.key;
    let digit: number = value;
    digit = isNaN(digit) ? 0 : digit;

    switch (name) {
      case "min1":
        setMinute({ ...minute, digit1: digit });
        break;
      case "min2":
        setMinute({ ...minute, digit2: digit });
        break;
      case "sec1":
        digit = digit > 6 ? 6 : digit;
        setSecond({ ...second, digit1: digit, digit2: 0 });
        break;
      case "sec2":
        digit = second.digit1 > 5 ? 0 : digit;
        setSecond({ ...second, digit2: digit });
        break;
    }
  }

  function startStopWatch(): void {
    let totalSeconds: number =
      (minute.digit1 * 10 + minute.digit2) * 60 +
      second.digit1 * 10 +
      second.digit2;
    if (totalSeconds > 0) {
      playAlert(totalSeconds);
    }

    setTotalRemainingSecconds(totalSeconds);
    if (totalSeconds > 0) setWatchState(start);
    showMessage(null);
  }

  function pauseStopwatch(): void {
    setWatchState(pause);
  }

  function resetStopwatch(): void {
    setWatchState(pause);
    setMinute(initialDigits);
    setSecond(initialDigits);
    setMessage(null);
  }
  // any vs unknown
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (watchState === start && totalRemainingSeconds === 0) {
      showMessage("success");
      pauseStopwatch();
    }
    if (watchState === start && totalRemainingSeconds > 0) {
      timeout = setTimeout(() => {
        let totalSeconds: number = totalRemainingSeconds - 1;
        let remainingMinute: number = Math.floor(totalSeconds / 60);
        let remainingSecond: number = totalSeconds % 60;
        setMinute(formatDigit(remainingMinute));
        setSecond(formatDigit(remainingSecond));
        setTotalRemainingSecconds(totalSeconds);
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [totalRemainingSeconds, watchState]);

  return (
    <>
      {message && (
        <>
          <div className="message">{message}</div>
        </>
      )}
      <div>
        <span className="minutes">
          <input
            type="number"
            onKeyDown={changeHandle}
            name="min1"
            value={minute.digit1}
            disabled={watchState === start}
            style={{ cursor: watchState === start ? "not-allowed" : "pointer" }}
          />
          <input
            type="number"
            onKeyDown={changeHandle}
            name="min2"
            value={minute.digit2}
            disabled={watchState === start}
            style={{ cursor: watchState === start ? "not-allowed" : "pointer" }}
          />
        </span>
        <label className="sep">:</label>
        <span className="seconds">
          <input
            type="number"
            onKeyDown={changeHandle}
            name="sec1"
            value={second.digit1}
            disabled={watchState === start}
            style={{ cursor: watchState === start ? "not-allowed" : "pointer" }}
          />
          <input
            type="number"
            onKeyDown={changeHandle}
            name="sec2"
            value={second.digit2}
            disabled={watchState === start}
            style={{ cursor: watchState === start ? "not-allowed" : "pointer" }}
          />
        </span>
      </div>

      <div style={{ margin: 20 }}>
        {watchState === pause ? (
          <button>
            <PlayArrowIcon
              onClick={startStopWatch}
              className="controls"
              color="success"
            />
          </button>
        ) : (
          <button>
            <PauseIcon
              onClick={pauseStopwatch}
              className="controls"
              fontSize="inherit"
            />
          </button>
        )}
        <button>
          <RestartAltIcon
            onClick={resetStopwatch}
            className="controls"
            fontSize="large"
          />
        </button>
      </div>
    </>
  );
}
