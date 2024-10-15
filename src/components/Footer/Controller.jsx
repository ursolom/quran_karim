import { HiOutlineStop, HiOutlineMenuAlt1 } from "react-icons/hi";
import { MdPlayCircle } from "react-icons/md";
import { FaStopCircle } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { AiFillSound } from "react-icons/ai";
import PropTypes from "prop-types";

const Controller = ({
  isPlaying,
  playAudio,
  stopAudio,
  changeSpeed,
  audioSpeed,
  showVolumeControl,
  volume,
  handleVolumeChange,
  setShowVolumeControl,
  toggleMenu,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3 transition-all duration-200 md:gap-7">
        <button
          onClick={playAudio}
          className="flex flex-col items-center justify-center gap-1 hover:text-green-200"
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
          className="flex flex-col items-center justify-center gap-1 hover:text-green-200"
        >
          <FaStopCircle className="md:text-[35px] text-[20px]" />
          <p>إيقاف</p>
        </button>

        <button
          onClick={changeSpeed}
          className="flex flex-col items-center justify-center gap-1 hover:text-green-200"
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
              className="h-3 overflow-hidden bg-green-600 rounded-lg appearance-none range-volume w-128"
            />
          </div>
          <button
            className="duration-100 hover:text-green-200 "
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
  );
};

export default Controller;

Controller.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  playAudio: PropTypes.func.isRequired,
  stopAudio: PropTypes.func.isRequired,
  changeSpeed: PropTypes.func.isRequired,
  audioSpeed: PropTypes.number.isRequired,
  showVolumeControl: PropTypes.bool.isRequired,
  volume: PropTypes.number.isRequired,
  handleVolumeChange: PropTypes.func.isRequired,
  setShowVolumeControl: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};
