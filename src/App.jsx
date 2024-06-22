import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Prayer from "./pages/Prayer";
import Profiler from "./pages/Profiler";
import { AiFillSound } from "react-icons/ai";
import { FaVolumeMute } from "react-icons/fa";
import axios from "axios";
import notification from "../public/audio/notification.mp3";
import sunrise from "../public/audio/sunrise.mp3";
import NotFond from "./pages/NotFond";
import { parse, isSameMinute, addMinutes, subMinutes } from "date-fns";

const prayerNames = ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"];
const adhanUrl =
  "https://ia600908.us.archive.org/12/items/90---azan---90---azan--many----sound----mp3---alazan/";

const adhanSounds = {
  الفجر: `${adhanUrl}035-.mp3`,
  الظهر: `${adhanUrl}052-.mp3`,
  العصر: `${adhanUrl}052-.mp3`,
  المغرب: `${adhanUrl}052-.mp3`,
  العشاء: `${adhanUrl}052-.mp3`,
  الشروق: sunrise,
};

const App = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem("selectedCity") || "cairo"
  );
  const [lastNotificationTime, setLastNotificationTime] = useState({});
  const [audioContextInitialized, setAudioContextInitialized] = useState(false);
  const [showMuteButton, setShowMuteButton] = useState(false);

  const audioRef = useRef(new Audio());
  const afterPrayerAudioRef = useRef(new Audio(notification));

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

  const fetchPrayerTimes = async (city) => {
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?country=egypt&city=${city}`
      );
      const timings = response.data?.data?.timings;
      if (timings) {
        setPrayerTimes(
          prayerNames.map((name) => ({
            name,
            time: timings[translatePrayerNameToEnglish(name)],
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
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
    fetchPrayerTimes(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    const checkPrayerTime = () => {
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

            if (!isMuted && audioSrc) {
              const audio = new Audio(audioSrc);
              audio.play().catch((error) => {
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

          if (!isMuted && adhanSounds[prayer.name]) {
            audioRef.current.src = adhanSounds[prayer.name];
            audioRef.current.play().catch((error) => {
              console.error(`Failed to play Adhan audio: ${error}`);
            });

            // لا يتم إيقاف الصوت هنا للسماح له باللعب بالكامل
          }
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

          if (!isMuted) {
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

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    localStorage.setItem("selectedCity", city);
    fetchPrayerTimes(city);
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
          <Route path="*" element={<NotFond />} />
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

export default App;
