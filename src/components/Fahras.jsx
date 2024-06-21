import { useState } from "react";
import PropTypes from "prop-types";
import surahMap from "../data/Surah";
import { CiSearch } from "react-icons/ci";
import { TiArrowBack } from "react-icons/ti";
import Meccan from "../../public/img_site/Meccan.png";
import Medinan from "../../public/img_site/Medinan.png";

const Fahras = ({ onSurahClick, onGoBack }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSurahMap = surahMap.filter((surah) =>
    surah.name.includes(searchTerm)
  );

  const handleSurahClick = (startPage) => {
    onSurahClick(startPage);
  };

  return (
    <div className="flex flex-col" dir="rtl">
      <header className="w-full bg-green-600 h-64 py-6 flex justify-center px-11 fixed z-10">
        <div className="w-full">
          <div className="flex items-center">
            <input
              type="text"
              className="w-full md:py-3 py-1 px-5 bg-transparent text-white outline-white placeholder-white text-[20px] transition-all"
              placeholder="البحث في الفهرس"
              dir="rtl"
              value={searchTerm}
              onChange={handleSearch}
            />
            <CiSearch className="text-white size-9 left-11 relative" />
          </div>
        </div>
        <button
          onClick={onGoBack}
          className="absolute top-0 left-0 text-white p-1 m-3 hover:ml-2 transition-all duration-200"
        >
          <TiArrowBack className="size-12" />
        </button>
      </header>
      <div className="relative top-44 flex flex-col md:text-[25px] text-[16px] ">
        <div className="w-full bg-white flex justify-between items-center py-7 px-5 rounded-t-3xl fixed z-10">
          <div className="flex gap-9">
            <div>#</div>
            <div>السورة</div>
          </div>
          <div className="flex gap-7">
            <div>الآيات</div>
            <div>مكان النزول</div>
          </div>
        </div>
        <div className="w-full top-24 bg-white relative ">
          {filteredSurahMap.map((surah) => (
            <button
              key={surah.number}
              onClick={() => handleSurahClick(surah.parts[0].startPage)}
              className="flex justify-between items-center py-7 px-5 hover:bg-gray-400 cursor-pointer transition-all duration-300 active:scale-90 border-b-[1px] border-black w-full "
            >
              <div className="flex gap-3 items-center">
                <div className="bg-green-300 rounded-full md:size-12 size-7 flex justify-center items-center">
                  {surah.number}
                </div>
                <div className="text-blue-500">{surah.name}</div>
              </div>
              <div className="flex gap-12 items-center">
                <div>{surah.ayat}</div>
                <div>
                  <img
                    src={surah.type === "Meccan" ? Meccan : Medinan}
                    alt={surah.type}
                    className="md:w-16 md:h-16 w-8 h-8"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

Fahras.propTypes = {
  onSurahClick: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default Fahras;
