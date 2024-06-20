import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IoLocation } from "react-icons/io5";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { PiSunHorizonFill } from "react-icons/pi";
import { GiStripedSun } from "react-icons/gi";
import { WiStars } from "react-icons/wi";
import { Link } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import cityData from "../data/City";
import Mosque from "../../public/img_site/Prayer/bg_mosque.jpg";

const defaultCity = localStorage.getItem("selectedCity") || "cairo";

const prayerIcons = {
  الفجر: <BsMoonStarsFill />,
  الشروق: <BsSunFill />,
  الظهر: <BsSunFill />,
  العصر: <GiStripedSun />,
  المغرب: <PiSunHorizonFill />,
  العشاء: <WiStars />,
};

const prayerNamesArabic = {
  الفجر: "الفجر",
  الشروق: "الشروق",
  الظهر: "الظهر",
  العصر: "العصر",
  المغرب: "المغرب",
  العشاء: "العشاء",
};

const prayerIconColors = {
  الفجر: "#3b82f6",
  الشروق: "#fbbf24",
  الظهر: "#fbbf24",
  العصر: "#f97316",
  المغرب: "#ef4444",
  العشاء: "#8b5cf6",
};

const Prayer = ({ prayerTimes, selectedCity, onCityChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const formatTime = (time24) => {
    const [hour24, minute] = time24.split(":").map(Number);
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const updateNextPrayer = () => {
    if (!prayerTimes || prayerTimes.length === 0) {
      return;
    }

    const now = new Date();
    const nowHour = now.getHours();
    const nowMinute = now.getMinutes();

    for (const prayer of prayerTimes) {
      const [hour, minute] = prayer.time.split(":").map(Number);
      if (hour > nowHour || (hour === nowHour && minute > nowMinute)) {
        setNextPrayer(prayer);
        setTimeLeft(calculateTimeLeft(now, hour, minute));
        return;
      }
    }

    const [hour, minute] = prayerTimes[0].time.split(":").map(Number);
    setNextPrayer(prayerTimes[0]);
    setTimeLeft(calculateTimeLeft(now, hour, minute, true));
  };

  const calculateTimeLeft = (now, hour, minute, isNextDay = false) => {
    const nextPrayerTime = new Date();
    if (isNextDay) {
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
    }
    nextPrayerTime.setHours(hour, minute, 0, 0);
    const diff = nextPrayerTime - now;

    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    } else {
      return "00:00:00";
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateNextPrayer();
    }, 1000);

    updateNextPrayer();

    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <div className="prayer-container md:text-[25px] text-[15px] overflow-hidden">
      <Link
        to="/"
        className="absolute top-5 left-5 z-40 p-2 rounded-xl text-white bg-neutral-900 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100"
      >
        <TiArrowBack />
      </Link>
      <div className="relative w-full h-[60vh] flex justify-center items-center">
        <span className="absolute w-full h-full -z-10"></span>
        <img
          src={Mosque}
          className="select-none top-0 left-0 z-0 w-full h-full object-cover absolute"
          style={{
            maskImage: `linear-gradient(black 90%, transparent 104%)`,
            WebkitMaskImage: `linear-gradient(black 90%, transparent 104%)`,
          }}
          alt=""
        />
        {nextPrayer && (
          <div className="bg-neutral-500 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 md:py-10 md:px-52 px-16 py-5 text-white z-10 rounded-lg flex flex-col gap-4 justify-center items-center">
            <p className="text-[20px]">{prayerNamesArabic[nextPrayer.name]}</p>
            <p>{formatTime(nextPrayer.time)}</p>
            <p>{timeLeft}</p>
          </div>
        )}
        <div
          className="absolute md:bottom-5 bottom-1 right-5 md:p-2 text-white bg-clip-padding backdrop-filter backdrop-blur bg-opacity-50 flex justify-center items-center gap-3"
          dir="rtl"
        >
          <IoLocation />
          <p>مـصــر</p>
          <p>-</p>
          <p>
            {
              cityData[0]?.cityes.find((city) => city.apiName === selectedCity)
                ?.displayName
            }
          </p>
        </div>
      </div>
      <div
        className="bg-gradient-to-r from-emerald-300 to-emerald-200 pb-10"
        style={{
          maskImage: `linear-gradient(black 80%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(black 80%, transparent 100%)`,
        }}
      >
        <select
          value={selectedCity}
          onChange={onCityChange}
          className="md:m-4 my-5 p-2 rounded md:w-1/2 w-full"
        >
          {cityData[0]?.cityes?.map((city) => (
            <option key={city.apiName} value={city.apiName}>
              {city.displayName}
            </option>
          ))}
        </select>
        <div className="grid md:grid-cols-3 grid-cols-1 md:gap-7 gap-1 md:p-3 p-1 gap-y-3 ">
          {prayerTimes.map((prayer) => (
            <div
              key={prayer.name}
              className="flex flex-col justify-center items-center p-4 rounded-lg relative shadow-lg bg-gradient-to-r from-teal-200 to-teal-500 "
            >
              <span>{prayerNamesArabic[prayer.name]}</span>
              <span className="prayer-clock">{formatTime(prayer.time)}</span>
              <span
                className="absolute top-0 right-5 text-[50px] flex items-center flex-row-reverse w-1/4 h-full"
                style={{ color: prayerIconColors[prayer.name] }}
              >
                {prayerIcons[prayer.name]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Prayer.propTypes = {
  prayerTimes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ),
  selectedCity: PropTypes.string.isRequired,
  onCityChange: PropTypes.func.isRequired,
};

export default Prayer;
