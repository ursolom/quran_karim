import PropTypes from "prop-types";

const Title = ({ title }) => (
  <div className="flex flex-col items-center justify-center w-full gap-1 mb-4 text-white">
    <h3 className="text-center text-xl">{title}</h3>
    <div className="flex flex-col items-center justify-center w-full gap-2">
      {[20, 14, 4].map((width, index) => (
        <span
          key={index}
          className={`relative h-1 bg-white w-${width} rounded-xl`}
        ></span>
      ))}
    </div>
  </div>
);

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

const SheikhButton = ({ sheikh, isSelected, onClick, bgColorClass }) => (
  <button
    onClick={() => onClick(sheikh)}
    className={`${
      isSelected
        ? "bg-white text-green-600"
        : `bg-green-600 text-white hover:bg-green-500`
    } p-2 rounded-lg transition-all duration-200 flex flex-col gap-2 justify-center items-center`}
  >
    <img
      src={sheikh.img}
      alt={sheikh.name}
      className="object-cover rounded-full w-20 h-20"
    />
    <p>{sheikh.name}</p>
    <span
      className={`w-1/2 h-1 rounded-lg ${
        isSelected ? bgColorClass : "bg-gray-300"
      }`}
    ></span>
  </button>
);

SheikhButton.propTypes = {
  sheikh: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  bgColorClass: PropTypes.string.isRequired,
};

const Popup = ({
  menuOpen,
  setMenuOpen,
  playMode,
  setPlayMode,
  selectedSheikh,
  selectedSheikhPage,
  availableSurahs,
  setSelectedSurah,
  sheikhs,
  sheikhsPage,
  selectSheikh,
  selectSheikhPage,
  selectedSurah,
}) => {
  const renderSheikhButtons = () => {
    const sheikhList = playMode === "surah" ? sheikhs : sheikhsPage;
    const selectedSheikhId =
      playMode === "surah" ? selectedSheikh.id : selectedSheikhPage.id;
    const onClickFunction =
      playMode === "surah" ? selectSheikh : selectSheikhPage;
    const bgColorClass = playMode === "surah" ? "bg-gray-600" : "bg-gray-400";

    return sheikhList.map((sheikh) => (
      <SheikhButton
        key={sheikh.id}
        sheikh={sheikh}
        isSelected={selectedSheikhId === sheikh.id}
        onClick={onClickFunction}
        bgColorClass={bgColorClass}
      />
    ));
  };

  return (
    <>
      <div
        className={`absolute bottom-[100px] left-1/2 transform md:gap-5 -translate-x-1/2 bg-green-600 rounded-xl flex flex-col justify-between p-4 transition-all
        duration-200 w-full max-h-[100vh] overflow-y-scroll z-50 shadow-lg ${
          menuOpen ? "opacity-100 top-0 visible" : "opacity-0 top-9 invisible"
        }`}
      >
      
        <div className="mt-4">
          <Title title="اختــر وضـع التشغيــل" />
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {["surah", "page"].map((mode) => (
              <button
                key={mode}
                onClick={() => setPlayMode(mode)}
                className={`${
                  playMode === mode
                    ? "bg-white text-green-600"
                    : "bg-green-600 text-white hover:bg-green-500"
                } p-2 rounded-lg transition-all duration-200`}
              >
                {mode === "surah" ? "ســورة" : "صــفــحــة"}
              </button>
            ))}
          </div>
        </div>
        <Title title="الـقــارئ" />
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4 border-b-2 border-green-400">
          {renderSheikhButtons()}
        </div>

        {playMode === "surah" && (
          <div className="mt-4">
            <Title title="اخـتـــر الــسورة" />
            <div className="flex flex-wrap justify-center gap-2 mt-2">
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
        className={`absolute top-0 left-0 z-20 w-full h-full bg-transparent ${
          menuOpen ? "visible" : "invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      ></span>
    </>
  );
};

Popup.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  playMode: PropTypes.oneOf(["surah", "page"]).isRequired,
  setPlayMode: PropTypes.func.isRequired,
  selectedSheikh: PropTypes.object.isRequired,
  selectedSheikhPage: PropTypes.object.isRequired,
  availableSurahs: PropTypes.array.isRequired,
  setSelectedSurah: PropTypes.func.isRequired,
  sheikhs: PropTypes.array.isRequired,
  sheikhsPage: PropTypes.array.isRequired,
  selectSheikh: PropTypes.func.isRequired,
  selectSheikhPage: PropTypes.func.isRequired,
  selectedSurah: PropTypes.object,
};

export default Popup;
