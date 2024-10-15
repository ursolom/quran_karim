import PropTypes from "prop-types";

const TopFooter = ({ surahName, currentPage, partNumber }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div>{surahName}</div>
      <div className="bg-green-600 size-9 rounded-3xl flex justify-center items-center border-[3px] md:p-6 p-2 shadow-lg">
        <span>{currentPage}</span>
      </div>
      <div>الجزء : {partNumber}</div>
    </div>
  );
};

TopFooter.propTypes = {
  surahName: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  partNumber: PropTypes.number.isRequired,
};

export default TopFooter;
