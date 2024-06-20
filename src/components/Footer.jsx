import { useState, useEffect, useRef } from "react";
import { MdPlayCircle } from "react-icons/md";
import { FaStopCircle } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { HiOutlineStop, HiOutlineMenuAlt1 } from "react-icons/hi";
import { getSurahByPage } from "../data/Surah";
import surahMap from "../data/Surah";
import sheikhs from "../data/Sheikhs";
import sheikhsPage from "../data/SheikhsPage";
import { AiFillSound } from "react-icons/ai";
import { gsap } from "gsap";
import "../App.css";

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
  const menuRef = useRef(null);

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
    if (menuRef.current) {
      if (menuOpen) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, scale: 0.1 },
          { opacity: 1, scale: 1, duration: 0.2 }
        );
      } else {
        gsap.to(menuRef.current, { opacity: 0, scale: 0.1, duration: 0.2 });
      }
    }
  }, [menuOpen]);

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
      audioRef.current.currentTime = e.target.value;
      setCurrentTime(e.target.value);
    }
  };
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
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
        className={`absolute bottom-0 left-0 md:px-8 md:py-2 p-1 bg-gradient-to-r from-green-500 via-green-600 to-green-700 w-full flex flex-col gap-3 text-white justify-center md:text-[22px] text-[15px] z-[8] transition-all duration-300 
            ${isContentActive ? "right-[-100%]" : "right-0"} shadow-md`}
      >
        <div className="flex w-full justify-between items-center">
          <div>{surahName}</div>
          <div className="bg-green-600 size-9 rounded-3xl flex justify-center items-center border-[3px] md:p-6 p-2 shadow-lg">
            <span>{currentPage}</span>
          </div>
          <div>الجزء : {partNumber}</div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex md:gap-7 gap-3 transition-all duration-200">
            <button
              onClick={playAudio}
              className="flex flex-col gap-1 justify-center items-center hover:text-green-200"
            >
              {isPlaying ? (
                <HiOutlineStop className="md:text-[35px] text-[20px]" />
              ) : (
                <MdPlayCircle className="md:text-[35px] text-[20px]" />
              )}
              <p>{isPlaying ? "إيقاف مؤقت" : "تشغيل"}</p>
            </button>

            <button
              onClick={stopAudio}
              className="flex flex-col gap-1 justify-center items-center hover:text-green-200"
            >
              <FaStopCircle className="md:text-[35px] text-[20px]" />
              <p>إيقاف</p>
            </button>

            <button
              onClick={changeSpeed}
              className="flex flex-col gap-1 justify-center items-center hover:text-green-200"
            >
              <RxLapTimer className="md:text-[35px] text-[20px]" />
              <p>{audioSpeed.toFixed(1)}x</p>
            </button>

            <div className="relative md:text-[30px] text-[20px]">
              <div
                className={`absolute bottom-16 -left-7 transition duration-150 bg-green-400 flex justify-center items-center px-3 py-2 rounded-xl ${
                  showVolumeControl ? " bottom-20 block" : "hidden"
                }`}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="range-volume rounded-lg overflow-hidden appearance-none bg-green-600 h-3 w-128"
                />
              </div>
              <button
                className="hover:text-green-200 duration-100 "
                onClick={() => setShowVolumeControl(!showVolumeControl)}
              >
                <AiFillSound />
              </button>
            </div>
          </div>
          <button
            className="md:text-[40px] text-[20px] transition-all duration-200 hover:text-green-200"
            onClick={toggleMenu}
          >
            <HiOutlineMenuAlt1 />
          </button>
        </div>
        <div className="flex flex-row justify-center items-center md:gap-4 gap-1 md:text-[25px] text-sm">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={audioDuration}
            value={currentTime}
            onChange={handleRangeChange}
            className="w-full mt-2 range-in-css"
          />

          <span>{formatTime(audioDuration)}</span>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
        />
      </footer>

      {menuOpen && (
        <>
          <div
            ref={menuRef}
            className="absolute bottom-[100px]  left-1/2 transform md:gap-5 -translate-x-1/2 bg-green-600 rounded-xl flex flex-col justify-between p-4 transition-all
              duration-200 w-full max-h-[50vh] overflow-y-scroll z-50 shadow-lg"
          >
            <div className="w-full mb-4 flex gap-1 flex-col justify-center items-center  text-white">
              <h3 className="text-center text-[20px]">الـقــارئ</h3>
              <div className="w-full flex flex-col justify-center gap-2 items-center">
                <span className="w-20 h-1 bg-white relative rounded-xl"></span>
                <span className="w-14 h-1 bg-white relative rounded-xl"></span>
                <span className="w-4 h-1 bg-white relative rounded-xl"></span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 border-b-2 justify-center items-center pb-4 border-green-400">
              {playMode === "surah"
                ? sheikhs.map((sheikh) => (
                    <button
                      key={sheikh.id}
                      onClick={() => selectSheikh(sheikh)}
                      className={`${
                        selectedSheikh.id === sheikh.id
                          ? "bg-white text-green-600"
                          : "bg-green-600 text-white hover:bg-green-500"
                      } p-2 rounded-lg transition-all duration-200 flex flex-col gap-2 justify-center items-center `}
                    >
                      <img
                        src={sheikh.img}
                        className="size-20 rounded-full object-cover"
                      />
                      <p>{sheikh.name}</p>
                      <span
                        className={`w-1/2 h-1 rounded-lg ${
                          selectedSheikh.id === sheikh.id
                            ? "bg-gray-600"
                            : "bg-gray-300"
                        } `}
                      ></span>
                    </button>
                  ))
                : sheikhsPage.map((sheikh) => (
                    <button
                      key={sheikh.id}
                      onClick={() => selectSheikhPage(sheikh)}
                      className={`${
                        selectedSheikhPage.id === sheikh.id
                          ? "bg-white text-green-600"
                          : "bg-green-600 text-white hover:bg-green-500"
                      } p-2 rounded-lg transition-all duration-200 flex flex-col gap-2 justify-center items-center `}
                    >
                      <img
                        src={sheikh.img}
                        className="size-20 rounded-full object-cover"
                      />
                      <p>{sheikh.name}</p>
                      <span
                        className={`w-1/2 h-1 rounded-xl${
                          selectedSheikhPage.id === sheikh.id
                            ? "bg-gray-400"
                            : "bg-gray-200"
                        } `}
                      ></span>
                    </button>
                  ))}
            </div>
            <div className="w-full mb-4 flex gap-1 flex-col justify-center items-center  text-white">
              <h3 className="text-center text-[20px]"> اختــر وضـع التشغيــل</h3>
              <div className="w-full flex flex-col justify-center gap-2 items-center">
                <span className="w-20 h-1 bg-white relative rounded-xl"></span>
                <span className="w-14 h-1 bg-white relative rounded-xl"></span>
                <span className="w-4 h-1 bg-white relative rounded-xl"></span>
              </div>
            </div>
            <div className="flex gap-2 justify-center mb-4">
              <button
                onClick={() => setPlayMode("surah")}
                className={`${
                  playMode === "surah"
                    ? "bg-white text-green-600"
                    : "bg-green-600 text-white hover:bg-green-500"
                } p-2 rounded-lg transition-all duration-200`}
              >
                ســورة
              </button>
              <button
                onClick={() => setPlayMode("page")}
                className={`${
                  playMode === "page"
                    ? "bg-white text-green-600"
                    : "bg-green-600 text-white hover:bg-green-500"
                } p-2 rounded-lg transition-all duration-200`}
              >
                صــفــحــة
              </button>
            </div>
            {playMode === "surah" && (
              <div className="mt-4">
                <div className="w-full mb-4 flex gap-1 flex-col justify-center items-center  text-white">
                  <h3 className="text-center text-[20px]">اخـتـــر الــسورة</h3>
                  <div className="w-full flex flex-col justify-center gap-2 items-center">
                    <span className="w-20 h-1 bg-white relative rounded-xl"></span>
                    <span className="w-14 h-1 bg-white relative rounded-xl"></span>
                    <span className="w-4 h-1 bg-white relative rounded-xl"></span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {availableSurahs.map((surah) => (
                    <button
                      key={surah.number}
                      onClick={() => setSelectedSurah(surah)}
                      className={`${
                        selectedSurah?.number === surah.number
                          ? "bg-white text-green-600"
                          : "bg-green-600 text-white hover:bg-green-500"
                      } p-2 rounded-lg transition-all duration-200`}
                    >
                      {surah.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <span
            className="w-full h-full bg-transparent z-20 absolute top-0 left-0"
            onClick={() => setMenuOpen(false)}
          ></span>
        </>
      )}
    </>
  );
}
