import { forwardRef } from "react";
import PropTypes from "prop-types";

const Popup = forwardRef(
  (
    {
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
    },
    ref
  ) => {
    return (
      <>
        <div
          ref={ref}
          className="absolute bottom-[100px] left-1/2 transform md:gap-5 -translate-x-1/2 bg-green-600 rounded-xl flex flex-col justify-between p-4 transition-all
        duration-200 w-full max-h-[50vh] overflow-y-scroll z-50 shadow-lg"
        >
          <div className="flex flex-col items-center justify-center w-full gap-1 mb-4 text-white">
            <h3 className="text-center text-[20px]">الـقــارئ</h3>
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <span className="relative w-20 h-1 bg-white rounded-xl"></span>
              <span className="relative h-1 bg-white w-14 rounded-xl"></span>
              <span className="relative w-4 h-1 bg-white rounded-xl"></span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pb-4 border-b-2 border-green-400">
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
                      alt={sheikh.name}
                      className="object-cover rounded-full size-20"
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
                      alt={sheikh.name}
                      className="object-cover rounded-full size-20"
                    />
                    <p>{sheikh.name}</p>
                    <span
                      className={`w-1/2 h-1 rounded-xl ${
                        selectedSheikhPage.id === sheikh.id
                          ? "bg-gray-400"
                          : "bg-gray-200"
                      } `}
                    ></span>
                  </button>
                ))}
          </div>
          <div className="flex flex-col items-center justify-center w-full gap-1 mb-4 text-white">
            <h3 className="text-center text-[20px]"> اختــر وضـع التشغيــل</h3>
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <span className="relative w-20 h-1 bg-white rounded-xl"></span>
              <span className="relative h-1 bg-white w-14 rounded-xl"></span>
              <span className="relative w-4 h-1 bg-white rounded-xl"></span>
            </div>
          </div>
          <div className="flex justify-center gap-2 mb-4">
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
              <div className="flex flex-col items-center justify-center w-full gap-1 mb-4 text-white">
                <h3 className="text-center text-[20px]">اخـتـــر الــسورة</h3>
                <div className="flex flex-col items-center justify-center w-full gap-2">
                  <span className="relative w-20 h-1 bg-white rounded-xl"></span>
                  <span className="relative h-1 bg-white w-14 rounded-xl"></span>
                  <span className="relative w-4 h-1 bg-white rounded-xl"></span>
                </div>
              </div>
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
          className="absolute top-0 left-0 z-20 w-full h-full bg-transparent"
          onClick={() => setMenuOpen(false)}
        ></span>
      </>
    );
  }
);

Popup.displayName = 'Popup';

Popup.propTypes = {
  setMenuOpen: PropTypes.func.isRequired,
  playMode: PropTypes.string.isRequired,
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
