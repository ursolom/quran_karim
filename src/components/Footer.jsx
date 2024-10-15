import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { getSurahByPage } from "../data/Surah";
import surahMap from "../data/Surah";
import sheikhs from "../data/Sheikhs";
import sheikhsPage from "../data/SheikhsPage";
import "../App.css";
import { Controller, Popup, TopFooter, BottomFooter } from "./Footer/index.js";

export default function Footer({ isContentActive, currentPage, onPageChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSheikh, setSelectedSheikh] = useState(() => {
    const savedSheikh = localStorage.getItem("selectedSheikh");
    return savedSheikh ? JSON.parse(savedSheikh) : sheikhs[0];
  });
  const [selectedSheikhPage, setSelectedSheikhPage] = useState(() => {
    const savedSheikhPage = localStorage.getItem("selectedSheikhPage");
    return savedSheikhPage ? JSON.parse(savedSheikhPage) : sheikhsPage[0];
  });
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [availableSurahs, setAvailableSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playMode, setPlayMode] = useState(() => {
    const savedPlayMode = localStorage.getItem("playMode");
    return savedPlayMode ? savedPlayMode : "surah";
  });
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("audioVolume");
    return savedVolume ? parseFloat(savedVolume) : 1;
  });
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("selectedSheikh", JSON.stringify(selectedSheikh));
  }, [selectedSheikh]);

  useEffect(() => {
    localStorage.setItem(
      "selectedSheikhPage",
      JSON.stringify(selectedSheikhPage)
    );
  }, [selectedSheikhPage]);

  useEffect(() => {
    localStorage.setItem("playMode", playMode);
  }, [playMode]);

  useEffect(() => {
    const newSurah = getSurahByPage(currentPage);
    setCurrentSurah(newSurah);
    setAvailableSurahs(
      surahMap.filter((surah) =>
        surah.parts.some(
          (part) => part.startPage <= currentPage && part.endPage >= currentPage
        )
      )
    );
    setSelectedSurah(newSurah);
  }, [currentPage]);

  useEffect(() => {
    if (selectedSurah && playMode === "surah" && !isPaused) {
      updateAudioSource(selectedSheikh.audioSource, selectedSurah.number);
    } else if (playMode === "page" && !isPaused) {
      updateAudioSource(selectedSheikhPage.audioSource, currentPage);
    }
  }, [
    selectedSurah,
    selectedSheikh,
    playMode,
    currentPage,
    selectedSheikhPage,
    isPaused,
  ]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        setAudioDuration(audioRef.current.duration);
      });
    }
  }, [audioRef.current?.src]);

  const updateAudioSource = (source, identifier) => {
    const audioSource = `${source}${identifier
      .toString()
      .padStart(3, "0")}.mp3`;
    if (audioRef.current && !isPlaying) {
      audioRef.current.src = audioSource;
      audioRef.current.playbackRate = audioSpeed;
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const selectSheikh = (sheikh) => {
    setSelectedSheikh(sheikh);
    setMenuOpen(false);
    resetAudio();
  };

  const selectSheikhPage = (sheikh) => {
    setSelectedSheikhPage(sheikh);
    setMenuOpen(false);
    resetAudio();
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.currentTime = currentTime;
        audioRef.current.play().catch(() => {});
      } else {
        setCurrentTime(audioRef.current.currentTime);
        audioRef.current.pause();
        setIsPaused(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopAudio = (e) => {
    e.preventDefault();
    resetAudio();
    const audioSource =
      playMode === "surah"
        ? `${selectedSheikh.audioSource}${selectedSurah.number
            .toString()
            .padStart(3, "0")}.mp3`
        : `${selectedSheikhPage.audioSource}${currentPage
            .toString()
            .padStart(3, "0")}.mp3`;

    if (audioSource) {
      audioRef.current.src = audioSource;
    }
  };

  const changeSpeed = () => {
    if (audioRef.current) {
      const newSpeed = audioSpeed >= 2 ? 0.1 : audioSpeed + 0.1;
      setAudioSpeed(newSpeed);
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleRangeChange = (e) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    localStorage.setItem("audioVolume", newVolume.toString());
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const sendPageNumberToContent = () => {
    onPageChange(currentPage);
  };

  useEffect(() => {
    sendPageNumberToContent();
  }, [currentPage, onPageChange]);

  const getPartByPage = (page) => {
    for (let surah of surahMap) {
      for (let part of surah.parts) {
        if (page >= part.startPage && page <= part.endPage) {
          return part.part;
        }
      }
    }
    return null;
  };

  const partNumber = getPartByPage(currentPage);
  const surahName =
    playMode === "surah" ? selectedSurah?.name : currentSurah?.name;

  return (
    <>
      <footer
        className={`absolute bottom-0 left-0 md:px-8 md:py-2 p-1 bg-gradient-to-r from-green-500 via-green-600 to-green-700 w-full flex flex-col gap-3 text-white justify-center md:text-[22px] text-[15px] z-10 shadow-md transition-all duration-300 ${
          isContentActive
            ? "right-[-100%] translate-x-full"
            : "right-0 translate-x-0"
        }`}
        style={{
          transition: "transform 0.5s ease-in-out",
        }}
      >
        <TopFooter
          surahName={surahName || ""}
          currentPage={currentPage}
          partNumber={partNumber}
        />

        <Controller
          isPlaying={isPlaying}
          playAudio={playAudio}
          stopAudio={stopAudio}
          changeSpeed={changeSpeed}
          audioSpeed={audioSpeed}
          showVolumeControl={showVolumeControl}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          setShowVolumeControl={setShowVolumeControl}
          toggleMenu={toggleMenu}
        />
        <BottomFooter
          currentTime={currentTime}
          audioDuration={audioDuration}
          handleRangeChange={handleRangeChange}
          handleTimeUpdate={handleTimeUpdate}
          handleAudioEnded={handleAudioEnded}
          audioRef={audioRef}
          formatTime={formatTime}
        />
      </footer>

      <Popup
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        playMode={playMode}
        setPlayMode={setPlayMode}
        selectedSheikh={selectedSheikh}
        selectedSheikhPage={selectedSheikhPage}
        availableSurahs={availableSurahs}
        setSelectedSurah={setSelectedSurah}
        sheikhs={sheikhs}
        sheikhsPage={sheikhsPage}
        selectSheikh={selectSheikh}
        selectSheikhPage={selectSheikhPage}
        selectedSurah={selectedSurah}
      />
    </>
  );
}

Footer.propTypes = {
  isContentActive: PropTypes.bool.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
