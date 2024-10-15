import PropTypes from "prop-types";

const BottomFooter = ({
  currentTime,
  audioDuration,
  handleRangeChange,
  handleTimeUpdate,
  handleAudioEnded,
  audioRef,
  formatTime
}) => {
  return (
    <>
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
    </>
  );
};

BottomFooter.propTypes = {
  currentTime: PropTypes.number.isRequired,
  audioDuration: PropTypes.number.isRequired,
  handleRangeChange: PropTypes.func.isRequired,
  handleTimeUpdate: PropTypes.func.isRequired,
  handleAudioEnded: PropTypes.func.isRequired,
  audioRef: PropTypes.object.isRequired,
  formatTime: PropTypes.func.isRequired
};

export default BottomFooter;
