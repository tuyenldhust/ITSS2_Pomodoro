import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import addNotification, { Notifications } from "react-push-notification";
import { BrowserRouter } from "react-router-dom";
import ChimeAlert from "./assets/sounds/chime.wav";
import SoftAlert from "./assets/sounds/soft.wav";
import { extractHourAndMinute } from "./helper/extractTime";
import TimeUpPopup from "./pop-up/TimeUp/index";
import WarningPopup from "./pop-up/WarningPopup";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { setLoadingFalse, setLoadingTrue } from "./redux/reducers/appReducer";
import {
  Process,
  minusOneSecond,
  setIsResetFalse,
  setIsRunningFalse,
  setLongBreak,
  setPomodoro,
  setShortBreak,
  setSleepReminder,
  setTimeWithProcessCorresponding,
  setToNextProcess,
} from "./redux/reducers/pomodoroReducer";
import {
  setCloseWarningPopup,
  setOpenTimeUpPopup,
  setOpenWarningPopup,
} from "./redux/reducers/popupReducer";
import Router from "./routes";

function App() {
  const dispatch = useAppDispatch();

  const isRunning = useAppSelector((state) => state.pomodoro.isRunning);
  const currentIteration = useAppSelector((state) => state.pomodoro.currentIteration);
  const currentProcess = useAppSelector((state) => state.pomodoro.currentProcess);

  const pomodoro = useAppSelector((state) => state.pomodoro.pomodoro);
  const shortBreak = useAppSelector((state) => state.pomodoro.shortBreak);
  const longBreak = useAppSelector((state) => state.pomodoro.longBreak);
  const sleepReminder = useAppSelector((state) => state.pomodoro.sleepReminder);

  const time = useAppSelector((state) => state.pomodoro.time);

  const [countOpenWarningPopup, setCountOpenWarningPopup] = useState(0);
  const isOpenWarningPopup = useAppSelector((state) => state.popup.isOpenWarningPopup);

  const isOpenTimeUpPopup = useAppSelector((state) => state.popup.isOpenTimeUpPopup);

  // Get Hour and Minute Now every time
  const [currentHour, setCurrentHour] = useState<number>(dayjs().hour()); // Assuming this is being updated elsewhere
  const [currentMinute, setCurrentMinute] = useState<number>(dayjs().minute()); // Assuming this is being updated elsewhere

  // Cookies
  const [cookies, setCookies] = useCookies(["alert_volume", "alert_choice"]);
  if (cookies.alert_volume === undefined) {
    setCookies("alert_volume", 50);
  }
  if (cookies.alert_choice === undefined) {
    setCookies("alert_choice", 1);
  }

  useEffect(() => {
    dispatch(setLoadingTrue());
    axios
      .get(`${import.meta.env.VITE_API_DOMAIN}/timer?user=1`)
      .then((res) => {
        dispatch(setPomodoro(res.data.pomodoro * 60));
        dispatch(setShortBreak(res.data.short_break * 60));
        dispatch(setLongBreak(res.data.long_break * 60));
        dispatch(setSleepReminder(res.data.sleep_time));
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Alert Sound
  const alertSound: any = [SoftAlert, ChimeAlert];
  const audioRef = useRef<HTMLAudioElement>(null);

  // Countdown time
  useEffect(() => {
    let timer: any;

    if (isRunning && time > 0) {
      timer = setInterval(() => {
        if (time > 0) {
          dispatch(minusOneSecond());
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [time, isRunning]);

  //Update Current Hour and Current Minute everytime
  useEffect(() => {
    // Update currentHour and currentMinute every minute
    const interval = setInterval(() => {
      setCurrentHour(dayjs().hour());
      setCurrentMinute(dayjs().minute());
    }, 60000); // Interval set to 1 minute (60,000 milliseconds)

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // set Time with Process is corresponding
  useEffect(() => {
    dispatch(setTimeWithProcessCorresponding());
  }, [currentProcess, pomodoro, shortBreak, longBreak]);

  // set Next Process if time of current Process is time up
  useEffect(() => {
    let timer: any;
    if (time === 0) {
      if (cookies.alert_choice !== 3) {
        audioRef.current?.play();
      }

      timer = setTimeout(() => {
        dispatch(setToNextProcess());
      }, 1000);

      addNotification({
        title: "Push Notification",
        message: "Time out " + currentProcess + " !",
        onClick: () => {
          window.focus();
        },
        native: true, // when using native, your OS will handle theming.
      });
    }

    return () => {
      clearTimeout(timer);
    };
  }, [time, pomodoro, shortBreak, longBreak]);

  // Display Reset button to Reset Pomodoro CLock
  useEffect(() => {
    if (time === 0 && currentProcess === Process.LONG_BREAK && currentIteration > 5) {
      dispatch(setIsRunningFalse());
      dispatch(setIsResetFalse());
    }
  }, [time, currentProcess, currentIteration]);

  // Show WarningPopup
  useEffect(() => {
    const { hour: sleepHour, minute: sleepMinute } = extractHourAndMinute(sleepReminder);
    const sleepTime = sleepHour * 60 * 60 + sleepMinute * 60;
    const currentTime = dayjs().hour() * 60 * 60 + dayjs().minute() * 60 + dayjs().second();

    const remainTimeMs = (sleepTime - currentTime) * 1000;

    console.log("Remain Time", remainTimeMs);

    if (remainTimeMs) {
      setTimeout(() => {
        console.log("Show Warning Popup");
        if (cookies.alert_choice !== 3) audioRef.current?.play();
        dispatch(setOpenWarningPopup());
      }, remainTimeMs);
    }

    return () => {
      dispatch(setCloseWarningPopup());
    };
  }, [sleepReminder, dispatch, cookies.alert_choice]);

  // Show TimeUpPopup
  useEffect(() => {
    if (
      (time == shortBreak && currentProcess == Process.SHORT_BREAK) ||
      (time == longBreak && currentProcess == Process.LONG_BREAK)
    ) {
      dispatch(setOpenTimeUpPopup());
      dispatch(setIsRunningFalse());
    }
  }, [time, currentProcess, currentIteration]);

  // Update Alert Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current!.volume = cookies.alert_volume / 100;
    }
  }, [cookies.alert_volume]);

  // Custom Title When Current Process and Time change
  // useCustomTitle()

  return (
    <BrowserRouter>
      <Router />

      <audio ref={audioRef} src={alertSound[cookies.alert_choice - 1]}></audio>
      <Notifications />

      <WarningPopup isOpen={isOpenWarningPopup} />
      <TimeUpPopup isOpen={isOpenTimeUpPopup} />
    </BrowserRouter>
  );
}

export default App;
