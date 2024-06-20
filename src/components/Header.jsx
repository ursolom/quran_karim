import { useState } from "react";
import { VscSearch } from "react-icons/vsc";
import { GoPaperAirplane } from "react-icons/go";
import { FiMenu, FiX } from "react-icons/fi";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { PiBooksFill } from "react-icons/pi";
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaMosque } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

export default function Header({
  isContentActive,
  onPageSearch,
  currentPage,
  toggleFahrasVisibility,
  toggleSearchVisibility,
}) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSpeedSearchMenuOpen, setSpeedSearchMenuOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState("");

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const toggleSpeedSearchMenu = () =>
    setSpeedSearchMenuOpen(!isSpeedSearchMenuOpen);

  const closeMenu = () => setMenuOpen(false);
  const closeSpeedSearchMenu = () => setSpeedSearchMenuOpen(false);

  const handlePageSearch = () => {
    const page = parseInt(pageNumber, 10);
    if (page >= 1 && page <= 604) {
      const loadingToastId = toast.loading("جاري البحث عن الصفحة...", {
        closeOnClick: true,
      });
      setTimeout(() => {
        toast.update(loadingToastId, {
          render: "تم العثور على الصفحة بنجاح!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
        onPageSearch(page);
        closeMenu();
      }, 300);
    } else {
      toast.error("رقم الصفحة غير صالح. الرجاء إدخال رقم بين 1 و 604.", {
        closeOnClick: true,
      });
    }
  };



  const handleBookmarkGoTo = () => {
    const savedBookmark = localStorage.getItem("bookmark");
    if (savedBookmark) {
      const page = parseInt(savedBookmark, 10);
      onPageSearch(page);
      closeMenu();
    } else {
      toast.error("لم يتم حفظ أي علامة.", {
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  };

  const menuItems = [
    {
      text: "الفهرس",
      icon: <PiBooksFill />,
      action: () => {
        toggleFahrasVisibility();
        closeMenu();
      },
    },
    {
      text: "الذهاب إلى العلامة",
      icon: <BsBookmarkCheckFill />,
      action: handleBookmarkGoTo,
    },
    { to: "/prayer", text: "مواقيت الصلاة", icon: <FaMosque /> },
    { to: "/profile", text: "عنا", icon: <IoPersonCircleSharp /> },
  ];

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <header
        className={`w-full py-5 flex justify-between gap-5 px-8 bg-gradient-to-r from-green-500 via-green-600 to-green-700 absolute text-white items-center z-10 transition-all duration-300 ${
          isContentActive ? "right-[-100%]" : "right-0"
        }`}
      >
        <div className="md:text-[30px] text-[20px]">
          <button
            onClick={toggleSearchVisibility}
            className="bg-green-700 shadow-lg rounded-t-full rounded-full rounded-tr-sm p-2 border-[2px] text-white hover:text-green-200 transition-all duration-100"
          >
            <VscSearch />
          </button>
        </div>
        <div className="md:text-[30px] text-[20px]">
          <button
            onClick={toggleSpeedSearchMenu}
            className="bg-green-700 shadow-lg rounded-t-full rounded-full rounded-tr-sm p-2 border-[2px] text-white hover:text-green-200 transition-all duration-100"
          >
            <GoPaperAirplane className="rotate-[315deg] translate-y-[-4px] translate-x-[3px]" />
          </button>
        </div>
        <div className="md:text-[30px] text-[20px]">
          <button
            onClick={toggleMenu}
            className="relative top-0 w-full h-full bg-green-700 shadow-lg rounded-t-full rounded-full rounded-tr-sm p-2 border-[2px] text-white hover:text-green-200 transition-all duration-100"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {/* Main Menu */}
      <div
        className={`p-3 flex flex-col gap-3 bg-green-600 absolute shadow-lg rounded-md z-50 md:text-[30px] text-[15px] text-white transition-all duration-400 ${
          isMenuOpen
            ? "w-[80%] md:w-80 md:right-8 overflow-visible right-5 scale-100 top-24 "
            : "p-0 border-0 w-[80%] md:w-80 overflow-hidden top-24  md:right-8  right-5 scale-0 opacity-0"
        }`}
      >
        <div className="relative w-full">
          <span className="absolute w-8 h-8 bg-[transparent] right-1 -top-11 border-t-transparent border-b-green-600 border-x-transparent border-[15px] border-[transparent_transparent_#479ba4_transparent] border-solid"></span>
        </div>
        {menuItems.map((item, index) =>
          item.to ? (
            <Link
              key={index}
              to={item.to}
              className="flex justify-between items-center border-[3px] p-2 w-full rounded-xl gap-5 cursor-pointer hover:bg-green-800 transition duration-200"
              onClick={closeMenu}
            >
              <span></span>
              <p className="ml-5 line-clamp-1">{item.text}</p>
              {item.icon}
            </Link>
          ) : (
            <button
              key={index}
              onClick={() => {
                item.action();
                closeMenu();
              }}
              className="flex justify-between items-center border-[3px] p-2 w-full rounded-xl gap-5 cursor-pointer hover:bg-green-800 transition duration-200"
            >
              <span></span>
              <p className="line-clamp-1">{item.text}</p>
              {item.icon}
            </button>
          )
        )}
      </div>

      {/* Close Main Menu */}
      {isMenuOpen && (
        <span
          onClick={closeMenu}
          className="w-full z-10 h-full absolute bg-transparent left-0 top-0"
        ></span>
      )}

      {/* Speed Search Menu */}
      <div
        className={`p-3 flex flex-col gap-3 bg-green-600 absolute rounded-md z-50 md:text-[25px] text-[15px] text-black transition-all duration-400 top-24 right-[25%] md:right-[40%]  ${
          isSpeedSearchMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <input
          type="number"
          min="1"
          max="604"
          placeholder="ادخل رقم الصفحة..."
          value={pageNumber}
          onChange={(e) => setPageNumber(e.target.value)}
          className="border-[2px] p-2 md:w-96 rounded-md"
        />
        <button
          onClick={handlePageSearch}
          className="bg-green-700 hover:bg-green-500  duration-200 shadow-2xl p-2 md:w-96 rounded-md text-white"
        >
          اذهب
        </button>
      </div>

      {/* Close Speed Search Menu */}
      {isSpeedSearchMenuOpen && (
        <span
          onClick={closeSpeedSearchMenu}
          className="w-full z-10 h-full absolute bg-transparent left-0 top-0"
        ></span>
      )}
    </>
  );
}
