import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PropTypes from "prop-types";
import surahMap from "../data/Surah";
import imageSources from "../data/Print";
import gsap from "gsap";
import bookMarkImage from "../../public/img_site/bookMark.png";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { FiMenu, FiX } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingAnimation from "./LoadingAnimation";

export default function Content({
  toggleContent,
  onPageChange,
  onPageSearch,
  currentPage,
  onSaveBookmark,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState([]);
  const [savedPage, setSavedPage] = useState(null);
  const [imageSourceIndex, setImageSourceIndex] = useState(0);
  const [isButtonMoved, setIsButtonMoved] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#fcd15c");
  const totalImages = 604;
  const preloadCountMobile = 2;
  const preloadCountDesktop = 4;
  const swiperRef = useRef(null);
  const bookmarkRef = useRef(null);
  const audioRef = useRef(null);

  const handleSlideChange = (swiper) => {
    const currentPageNumber = swiper.activeIndex + 1;
    if (typeof onPageChange === "function") {
      onPageChange(currentPageNumber);
    }
    preloadImages(swiper.activeIndex);

    localStorage.setItem("currentPage", currentPageNumber);

    const currentSurah = surahMap.find(
      (surah) =>
        currentPageNumber >= surah.start && currentPageNumber <= surah.end
    );
    if (currentSurah) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(currentSurah.audioUrl);
      audioRef.current.play();
    }
  };

  const preloadImages = (currentIndex) => {
    const preloadCount =
      window.innerWidth >= 768 ? preloadCountDesktop : preloadCountMobile;
    const newLoadedImages = [];
    for (let i = currentIndex; i <= currentIndex + preloadCount; i++) {
      if (i < totalImages && !loadedImages.includes(i)) {
        newLoadedImages.push(i);
      }
    }
    setLoadedImages((prevLoadedImages) => [
      ...new Set([...prevLoadedImages, ...newLoadedImages]),
    ]);
  };

  const handleImageLoad = (index) => {
    if (index === loadedImages[loadedImages.length - 1]) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedBookmark = localStorage.getItem("bookmark");
    if (savedBookmark) {
      const page = parseInt(savedBookmark, 10);
      setSavedPage(page);
      onPageSearch(page);
    }
  }, []);

  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      const page = parseInt(savedPage, 10);
      onPageSearch(page);
    }
  }, []);

  useEffect(() => {
    const savedBackgroundColor = localStorage.getItem("backgroundColor");
    if (savedBackgroundColor) {
      if (/^#[0-9A-F]{6}$/i.test(savedBackgroundColor)) {
        setBackgroundColor(savedBackgroundColor);
      } else {
        toast.error("لون الخلفية غير صالح، تم تعيين اللون الافتراضي.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }, []);

  useEffect(() => {
    preloadImages(currentPage - 1);
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentPage - 1);
    }
  }, [currentPage]);

  useEffect(() => {
    const handleResize = () => {
      preloadImages(currentPage - 1);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentPage]);

  useEffect(() => {
    if (onPageSearch) {
      onPageSearch(currentPage);
    }
  }, [currentPage, onPageSearch]);

  useEffect(() => {
    const savedImageSourceIndex = localStorage.getItem("imageSourceIndex");
    if (savedImageSourceIndex) {
      setImageSourceIndex(parseInt(savedImageSourceIndex, 10));
    }
  }, []);

  const showSavedPageIndicator =
    savedPage !== null && currentPage === savedPage;

  useEffect(() => {
    if (showSavedPageIndicator && bookmarkRef.current) {
      gsap.fromTo(
        bookmarkRef.current,
        { height: "0rem" },
        { height: "9rem", duration: 1, ease: "back.out(2)" }
      );
    }
  }, [showSavedPageIndicator]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem("currentPage", currentPage);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [currentPage]);

  const handleSaveBookmarkClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onSaveBookmark(currentPage);
    setSavedPage(currentPage);
    setIsButtonMoved(true);
  };

  const handleImageSourceChange = (index) => {
    setImageSourceIndex(index);
    localStorage.setItem("imageSourceIndex", index);
  };

  const getImageUrl = (index) => {
    const source = imageSources[imageSourceIndex];
    let imageUrl = `${source.baseUrl}${index}${source.extension}`;
    if (source.baseUrl.includes("surahquran.com")) {
      imageUrl = `${source.baseUrl}${index.toString().padStart(3, "0")}${
        source.extension
      }`;
    }
    return imageUrl;
  };

  const toggleSidebar = (event) => {
    event.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClick = (event) => {
    event.stopPropagation();
  };

  const handleColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  const handleSaveColorChange = () => {
    if (/^#[0-9A-F]{6}$/i.test(backgroundColor)) {
      localStorage.setItem("backgroundColor", backgroundColor);
      toast.success("تم حفظ التغيير", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("لون الخلفية غير صالح، يرجى إدخال لون صالح.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div
      onClick={toggleContent}
      className="w-full h-[100vh] flex justify-center items-center relative"
      dir="rtl"
    >
      <ToastContainer />
      {isLoading && <LoadingAnimation />}
      {showSavedPageIndicator && (
        <div
          ref={bookmarkRef}
          className="absolute w-12 h-1 top-0 left-0 z-10 select-none"
        >
          <img
            src={bookMarkImage}
            alt="bookMark"
            className="size-full h-full"
          />
        </div>
      )}
      <Swiper
        className="size-full flex justify-center items-center select-none transition-all duration-75"
        style={{ backgroundColor }}
        spaceBetween={50}
        onSlideChange={handleSlideChange}
        speed={600}
        slidesPerView={1}
        slidesPerGroup={1}
        initialSlide={currentPage - 1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        breakpoints={{
          768: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
        }}
      >
        {[...Array(totalImages).keys()].map((index) => (
          <SwiperSlide key={index}>
            {loadedImages.includes(index) ? (
              <img
                src={getImageUrl(index + 1)}
                className="size-full md:object-contain  select-none"
                alt={`Slide ${index + 1}`}
                onLoad={() => handleImageLoad(index)}
              />
            ) : (
              <div className="size-full flex justify-center items-center bg-white">
                <div className="loader"></div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {isSidebarOpen && (
        <span
          className="absolute size-full bg-transparent z-40"
          onClick={toggleSidebar}
        ></span>
      )}
      <div
        onClick={handleSidebarClick}
        className={`absolute top-0 p-5 left-0 bg-white z-[41] flex flex-col justify-center h-full items-center gap-4 transition-transform duration-300         ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }
      `}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-10 border-4 border-body bg-green-600 p-2 flex justify-center items-center text-[25px] rounded-full border-gray-100 text-white"
        >
          {isSidebarOpen ? <FiX /> : <FiMenu />}
        </button>
        <div>
          <input
            type="color"
            onChange={handleColorChange}
            value={backgroundColor}
          />
          <button
            onClick={handleSaveColorChange}
            className="p-2 bg-green-600 m-3 text-white hover:bg-green-500 transition-all duration-100 rounded-lg"
          >
            حفظ التغيير
          </button>
        </div>
        <button
          onClick={handleSaveBookmarkClick}
          className={`bg-green-600 transform hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center justify-between gap-4 border-white transition-all duration-150 ${
            isButtonMoved ? " translate-x-7" : ""
          }`}
        >
          {savedPage === currentPage ? "تم حفظ العلامة" : "حفظ علامة"}
          <BsFillBookmarkPlusFill className="mr-2" />
        </button>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          {imageSources.map((source, index) => (
            <button
              key={index}
              onClick={() => handleImageSourceChange(index)}
              className={`px-4 py-2 font-bold rounded-full shadow-lg border ${
                imageSourceIndex === index
                  ? "bg-green-600 text-white"
                  : "bg-white text-black"
              }`}
            >
              {source.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
Content.propTypes = {
  isContentActive: PropTypes.bool.isRequired,
  toggleContent: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSearch: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  onSaveBookmark: PropTypes.func.isRequired,
};
