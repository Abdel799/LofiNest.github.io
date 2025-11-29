import { createContext, useContext, useState, useEffect, useRef } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [time, setTime] = useState({ hour: 0, minute: 0, second: 0 });
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // Load saved time from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedTimer");
    if (saved) {
      setTime(JSON.parse(saved));
    }
  }, []);

  // Save time automatically whenever it changes
  useEffect(() => {
    localStorage.setItem("savedTimer", JSON.stringify(time));
  }, [time]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const tick = () => {
    setTime(prev => {
      let { hour, minute, second } = prev;

      if (hour === 0 && minute === 0 && second === 0) {
        clearInterval(intervalRef.current);
        setRunning(false);

        if (Notification.permission === "granted") {
          new Notification("⏰ Time's up!", {
            body: "Your StudyJam timer has finished.",
            icon: "/icon.png" // optional icon
          });
        }

        return { hour: 0, minute: 0, second: 0 };
      }

      if (second > 0) second--;
      else if (minute > 0) { minute--; second = 59; }
      else if (hour > 0) { hour--; minute = 59; second = 59; }

      return { hour, minute, second };
    });
  };

  const start = () => {
    if (!running) {
      intervalRef.current = setInterval(tick, 1000);
      setRunning(true);
    }
  };

  const pause = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTime({ hour: 0, minute: 0, second: 0 });
  };

  // Clean up interval on unmount
  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <TimerContext.Provider value={{ time, setTime, running, start, pause, reset }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
