import PropTypes from "prop-types";
import { IoMdCloseCircleOutline } from "react-icons/io";
import useMeasure from "react-use-measure";
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion,
} from "framer-motion";

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

const SheikhButton = ({
  sheikh,
  isSelected,
  onClick,
  bgColorClass,
  setMenuOpen,
}) => (
  <button
    onClick={() => {
      onClick(sheikh);
      if (typeof setMenuOpen === 'function') {
        setMenuOpen(false);
      }
    }}
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
  setMenuOpen: PropTypes.func,
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
  const [scope, animate] = useAnimate();
  const [drawerRef, { height }] = useMeasure();

  const y = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, {
      opacity: [1, 0],
    });

    const yStart = typeof y.get() === "number" ? y.get() : 0;

    await animate("#drawer", {
      y: [yStart, height],
    });

    setMenuOpen(false);
  };

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
        setMenuOpen={setMenuOpen}
      />
    ));
  };

  return (
    <>
      {menuOpen && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-neutral-950/70"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{
              ease: "easeInOut",
            }}
            className="absolute bottom-0 h-[75vh] w-full overflow-hidden rounded-t-3xl bg-green-600"
            style={{ y }}
            drag="y"
            dragControls={controls}
            onDragEnd={() => {
              if (y.get() >= 100) {
                handleClose();
              }
            }}
            dragListener={false}
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
            dragElastic={{
              top: 0,
              bottom: 0.5,
            }}
          >
            <div className="absolute left-0 right-0 top-0 z-10 flex justify-center bg-green-600 p-4">
              <button
                onPointerDown={(e) => {
                  controls.start(e);
                }}
                className="h-2 w-14 cursor-grab touch-none rounded-full bg-white active:cursor-grabbing"
              ></button>
            </div>
            <div className="relative z-0 h-full overflow-y-scroll p-4 pt-12">
              <IoMdCloseCircleOutline
                className="absolute top-10 right-5 text-white text-3xl hover:scale-110 rotate-45 hover:rotate-180 transition-all duration-300"
                onClick={handleClose}
              />
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
          </motion.div>
        </motion.div>
      )}
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
