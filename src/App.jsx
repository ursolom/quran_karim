import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import Home from "./pages/Home";
import Prayer from "./pages/Prayer";
import Profiler from "./pages/Profiler";
// import NotFound from "./pages/NotFound";
import { AiFillSound } from "react-icons/ai";
import { FaVolumeMute } from "react-icons/fa";
import { parse, isSameMinute, addMinutes, subMinutes } from "date-fns";
import notification from "../public/audio/notification.mp3";
import sunrise from "../public/audio/sunrise.mp3";
import QueryProvider from "./provider/Query";

const prayerNames = ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"];
const adhanUrl = "https://dl.doaa.top/dl/1027.mp3";

const adhanSounds = {
  الفجر: `${adhanUrl}1010-.mp3`,
  الظهر: `${adhanUrl}1027-.mp3`,
  العصر: `${adhanUrl}1027-.mp3`,
  المغرب: `${adhanUrl}1027-.mp3`,
  العشاء: `${adhanUrl}1027-.mp3`,
  الشروق: sunrise,
};

const fetchPrayerTimes = async (city) => {
  const response = await axios.get(
    `https://api.aladhan.com/v1/timingsByCity?country=egypt&city=${city}`
  );
  const timings = response.data?.data?.timings;
  if (timings) {
    return prayerNames.map((name) => ({
      name,
      time: timings[translatePrayerNameToEnglish(name)],
    }));
  }
  throw new Error("Failed to fetch prayer times");
};

const translatePrayerNameToEnglish = (name) => {
  const translation = {
    الفجر: "Fajr",
    الشروق: "Sunrise",
    الظهر: "Dhuhr",
    العصر: "Asr",
    المغرب: "Maghrib",
    العشاء: "Isha",
  };
  return translation[name];
};

const AppContent = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem("selectedCity") || "cairo"
  );
  const [lastNotificationTime, setLastNotificationTime] = useState({});
  const [audioContextInitialized, setAudioContextInitialized] = useState(false);
  const [showMuteButton, setShowMuteButton] = useState(false);

  const audioRef = useRef(new Audio());
  const afterPrayerAudioRef = useRef(new Audio(notification));

  const { data: prayerTimes, refetch: refetchPrayerTimes } = useQuery(
    ["prayerTimes", selectedCity],
    () => fetchPrayerTimes(selectedCity),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 24 * 60 * 60 * 1000,
    }
  );

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
    afterPrayerAudioRef.current.muted = !isMuted;
  };

  const shouldNotify = (lastNotification, now) => {
    if (!lastNotification) return true;
    const diff = now - new Date(lastNotification);
    return diff > 60 * 1000;
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const initializeAudioContext = () => {
      if (!audioContextInitialized) {
        setAudioContextInitialized(true);
        const silentAudio = new Audio(
          "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YQAAAAA="
        );
        silentAudio.play().catch((error) => {
          console.error("Failed to initialize audio context:", error);
        });
      }
    };

    const handleClick = () => {
      if (!audioContextInitialized) {
        initializeAudioContext();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [audioContextInitialized]);

  useEffect(() => {
    const checkPrayerTime = () => {
      if (!prayerTimes) return;

      const now = new Date();

      prayerTimes.forEach((prayer) => {
        const prayerTime = parse(prayer.time, "HH:mm", new Date());

        const triggerNotification = (message, prayerName, type, audioSrc) => {
          const key = `${prayerName}-${type}`;
          if (shouldNotify(lastNotificationTime[key], now)) {
            new Notification(message.title, { body: message.body });
            setLastNotificationTime((prevTimes) => ({
              ...prevTimes,
              [key]: now,
            }));

            if (type === "adhan") {
              setShowMuteButton(true);
            }

            if (!isMuted && audioSrc && audioRef.current.paused) {
              audioRef.current.src = audioSrc;
              audioRef.current.play().catch((error) => {
                console.error(`Failed to play notification audio: ${error}`);
              });
            }
          }
        };

        const tenMinutesBefore = subMinutes(prayerTime, 10);

        if (isSameMinute(now, tenMinutesBefore)) {
          triggerNotification(
            {
              title: "تنبيه",
              body: `متبقي 10 دقائق على وقت صلاة ${prayer.name}`,
            },
            prayer.name,
            "before"
          );
        }

        if (isSameMinute(now, prayerTime)) {
          triggerNotification(
            {
              title: "وقت الصلاة",
              body: `حان الآن وقت صلاة ${prayer.name}`,
            },
            prayer.name,
            "adhan",
            adhanSounds[prayer.name]
          );
        }

        let minutesAfterPrayer;
        if (prayer.name === "المغرب") {
          minutesAfterPrayer = 5;
        } else {
          minutesAfterPrayer = 15;
        }

        const afterPrayerTime = addMinutes(prayerTime, minutesAfterPrayer);

        if (isSameMinute(now, afterPrayerTime)) {
          triggerNotification(
            {
              title: "تنبيه",
              body: `حان الآن وقت إقامة صلاة ${prayer.name}`,
            },
            prayer.name,
            "iqama",
            notification
          );

          if (!isMuted && afterPrayerAudioRef.current.paused) {
            afterPrayerAudioRef.current.src = notification;
            afterPrayerAudioRef.current.play().catch((error) => {
              console.error(`Failed to play after prayer audio: ${error}`);
            });
          }
        }
      });
    };

    const interval = setInterval(checkPrayerTime, 1000);
    checkPrayerTime();

    return () => clearInterval(interval);
  }, [prayerTimes, isMuted, lastNotificationTime]);

  useEffect(() => {
    const handleAdhanPlaying = () => {
      setShowMuteButton(true);
    };

    const handleAdhanEnded = () => {
      setShowMuteButton(false);
    };

    const adhanAudio = audioRef.current;
    adhanAudio.addEventListener("playing", handleAdhanPlaying);
    adhanAudio.addEventListener("ended", handleAdhanEnded);

    return () => {
      adhanAudio.removeEventListener("playing", handleAdhanPlaying);
      adhanAudio.removeEventListener("ended", handleAdhanEnded);
    };
  }, []);

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    localStorage.setItem("selectedCity", city);
    refetchPrayerTimes();
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            path="/prayer"
            element={
              <Prayer
                prayerTimes={prayerTimes}
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
              />
            }
          />
          <Route path="/profile" element={<Profiler />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
        {showMuteButton && (
          <button
            id="mute-button"
            onClick={toggleMute}
            className="absolute top-3 right-3 bg-green-600 rounded-lg p-2 text-[30px] text-white hover:bg-green-500 z-[9999]"
          >
            {isMuted ? (
              <FaVolumeMute className="text-red-700" />
            ) : (
              <AiFillSound />
            )}
          </button>
        )}
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  );
};

export default App;
