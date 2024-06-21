import { useEffect, useState, useRef, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Prayer from "./pages/Prayer";
import Profiler from "./pages/Profiler";
import MouseAnimation from "./components/MouseAnimation";
import { AiFillSound } from "react-icons/ai";
import { FaVolumeMute } from "react-icons/fa";
import axios from "axios";
import notification from "../public/audio/notification.mp3";
import sunrise from "../public/audio/sunrise.mp3";
import NotFond from "./pages/NotFond";

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
  const [lastNotificationTime, setLastNotificationTime] = useState(null);
  const [audioContextInitialized, setAudioContextInitialized] = useState(false);

  const audioRef = useRef(new Audio());
  const afterPrayerAudioRef = useRef(new Audio(notification));

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
    afterPrayerAudioRef.current.muted = !isMuted;
  };

  const shouldNotify = useCallback((lastNotification, now) => {
    if (!lastNotification) return true;
    const diff = now - lastNotification;
    return diff > 60 * 1000;
  }, []);

  const fetchPrayerTimes = useCallback(async (city) => {
    const cachedData = localStorage.getItem(`prayerTimes_${city}`);
    const now = new Date().getTime();
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (now - timestamp < 24 * 60 * 60 * 1000) {
        setPrayerTimes(data);
        return;
      }
    }
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?country=egypt&city=${city}`
      );
      const timings = response.data?.data?.timings;
      if (timings) {
        const times = prayerNames.map((name) => ({
          name,
          time: timings[translatePrayerNameToEnglish(name)],
        }));
        setPrayerTimes(times);
        localStorage.setItem(
          `prayerTimes_${city}`,
          JSON.stringify({ data: times, timestamp: now })
        );
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  }, []);

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

    const checkPrayerTime = () => {
      const now = new Date();

      prayerTimes.forEach((prayer) => {
        const [hour, minute] = prayer.time.split(":").map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(hour, minute, 0, 0);

        const triggerNotification = (message) => {
          if (shouldNotify(lastNotificationTime, now)) {
            new Notification(message.title, { body: message.body });
            setLastNotificationTime(now);
          }
        };

        const tenMinutesBefore = new Date(
          prayerTime.getTime() - 10 * 60 * 1000
        );

        if (
          now.getHours() === tenMinutesBefore.getHours() &&
          now.getMinutes() === tenMinutesBefore.getMinutes() &&
          now.getSeconds() === 0
        ) {
          triggerNotification({
            title: "تنبيه",
            body: `متبقي 10 دقائق على وقت صلاة ${prayer.name}`,
          });
        }

        if (
          now.getHours() === hour &&
          now.getMinutes() === minute &&
          now.getSeconds() === 0
        ) {
          triggerNotification({
            title: "وقت الصلاة",
            body: `حان الآن وقت صلاة ${prayer.name}`,
          });

          if (!isMuted && adhanSounds[prayer.name]) {
            audioRef.current.src = adhanSounds[prayer.name];
            audioRef.current.play().catch((error) => {
              console.error(`Failed to play Adhan audio: ${error}`);
            });
            document.getElementById("mute-button").style.display = "block";

            setTimeout(() => {
              document.getElementById("mute-button").style.display = "none";
            }, 4 * 60 * 1000);
          }
        }

        const fifteenMinutesAfter = new Date(
          prayerTime.getTime() + 15 * 60 * 1000
        );
        const fiveMinutesAfterMaghrib = new Date(
          prayerTime.getTime() + 5 * 60 * 1000
        );

        if (
          ["الفجر", "الظهر", "العصر", "العشاء"].includes(prayer.name) &&
          now.getHours() === fifteenMinutesAfter.getHours() &&
          now.getMinutes() === fifteenMinutesAfter.getMinutes() &&
          now.getSeconds() === 0
        ) {
          triggerNotification({
            title: "تنبيه",
            body: `حان الآن وقت إقامة صلاة ${prayer.name}`,
          });

          if (!isMuted) {
            afterPrayerAudioRef.current.play().catch((error) => {
              console.error(`Failed to play after prayer audio: ${error}`);
            });
          }
        }

        if (
          prayer.name === "المغرب" &&
          now.getHours() === fiveMinutesAfterMaghrib.getHours() &&
          now.getMinutes() === fiveMinutesAfterMaghrib.getMinutes() &&
          now.getSeconds() === 0
        ) {
          triggerNotification({
            title: "تنبيه",
            body: `حان الآن وقت إقامة صلاة ${prayer.name}`,
          });

          if (!isMuted) {
            afterPrayerAudioRef.current.play().catch((error) => {
              console.error(`Failed to play after prayer audio: ${error}`);
            });
          }
        }
      });
    };

    const updateInterval = () => {
      const now = new Date();
      const nextCheck = new Date(now.getTime() + 60000); // Next minute
      const nextCheckDelay = nextCheck.getTime() - now.getTime();
      setTimeout(() => {
        checkPrayerTime();
        updateInterval();
      }, nextCheckDelay);
    };

    updateInterval();
    checkPrayerTime();
  }, [prayerTimes, selectedCity, isMuted, fetchPrayerTimes, shouldNotify]);

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    localStorage.setItem("selectedCity", city);
    fetchPrayerTimes(city);
  };

  return (
    <Router>
      <div>
        <MouseAnimation />
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
        <button
          id="mute-button"
          onClick={toggleMute}
          style={{ display: "none" }}
          className="absolute top-3 right-3 bg-green-600 rounded-lg p-2 text-[30px] text-white hover:bg-green-500 z-[9999]"
        >
          {isMuted ? (
            <FaVolumeMute className="text-red-700" />
          ) : (
            <AiFillSound />
          )}
        </button>
      </div>
    </Router>
  );
};

export default App;
