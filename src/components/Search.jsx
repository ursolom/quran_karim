import { useState, useRef, useCallback, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { TiArrowBack } from "react-icons/ti";
import QuranSearch from "../data/QuranSearch";
import surahMap from "../data/Surah";
import PageData from "../data/PageData";
import PropTypes from "prop-types";
import _ from 'lodash';

const wordOccurrences = (text, word) => {
  const regex = new RegExp(word, "gi");
  const matches = text.match(regex);
  return matches ? matches.length : 0;
};

const findPage = (surah, ayah) => {
  for (let i = 0; i < PageData.length; i++) {
    const pages = PageData[i];
    for (let page of pages) {
      if (page.surah === surah && page.start <= ayah && ayah <= page.end) {
        return i + 1;
      }
    }
  }
  return null;
};

const Search = ({ onVerseClick, onHide }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const resultsContainerRef = useRef(null);

  const handleSearch = useCallback(
    _.debounce((term) => {
      if (term.trim().length < 3) {
        setIsInputValid(false);
        setSearchResults([]);
        return;
      } else {
        setIsInputValid(true);
      }

      setIsLoading(true);

      const searchResults = QuranSearch.filter((verse) =>
        term
          .trim()
          .split(" ")
          .filter(Boolean)
          .every((word) => verse.content.includes(word))
      );

      setSearchResults(searchResults);
      setIsLoading(false);
    }, 300),
    []
  );

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleVerseClick = useCallback(
    (surahNumber, verseNumber) => {
      const page = findPage(surahNumber, verseNumber);
      if (page && onVerseClick) {
        onVerseClick(page);
        onHide();
      }
    },
    [onVerseClick, onHide]
  );

  const handleBackClick = useCallback(() => {
    if (onHide) {
      onHide();
    }
  }, [onHide]);

  const totalOccurrences = useMemo(() => {
    return searchResults.reduce(
      (total, verse) => total + wordOccurrences(verse.content, searchTerm),
      0
    );
  }, [searchResults, searchTerm]);

  return (
    <div className="flex flex-col" dir="rtl">
      <header className="w-full bg-green-600 h-64 py-6 flex justify-center px-11 fixed z-10">
        <div className="w-full">
          <div className="flex items-center">
            <input
              type="text"
              className="w-full md:py-3 py-1 px-5 bg-transparent text-white outline-none placeholder-white text-[20px] transition-all focus:outline-white rounded focus:rounded-xl"
              placeholder="البحث في القرآن الكريم"
              dir="rtl"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <CiSearch className="text-white size-9 left-11 relative -z-10" />
          </div>
        </div>
        <button
          className="absolute top-0 left-0 text-white p-1 m-3 hover:ml-2 transition-all duration-200"
          onClick={handleBackClick}
        >
          <TiArrowBack className="size-12" />
        </button>
      </header>
      <div className="relative top-44 flex flex-col md:text-[25px] text-[16px] text-black">
        <div className="w-full bg-white flex justify-between items-center py-10 px-5 rounded-t-3xl fixed z-10">
          {!isInputValid && (
            <div className="md:text-[25px] text-[15px] mb-3 w-full">
              يرجى إدخال ثلاثة أحرف على الأقل للبحث
            </div>
          )}
          {!isLoading && searchTerm && (
            <div className="w-full flex justify-between items-center">
              <div>عدد ظهور الكلمة</div>
              <div>&quot;{searchTerm}&quot;</div>
              <div>{totalOccurrences}</div>
            </div>
          )}
        </div>
        {isLoading && (
          <div className="flex flex-col gap-5 py-5 px-3 border-b-2">
            <div className="bg-gray-600 h-4 w-full rounded-md animate-pulse" />
          </div>
        )}
        <div ref={resultsContainerRef}>
          {searchResults.map((verse, index) => {
            const page = findPage(verse.surah_number, verse.verse_number);
            return (
              <div
                key={index}
                className="top-24 bg-white relative py-5 md:px-7 flex flex-col gap-5 px-3 border-b-2 hover:bg-blue-200 active:scale-90 transition duration-100"
                onClick={() =>
                  handleVerseClick(verse.surah_number, verse.verse_number)
                }
              >
                <div className="md:text-[25px] text-[15px]">
                  {verse.content}
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <div>
                    <div>
                      سورة
                      {
                        surahMap.find(
                          (surah) => surah.number === verse.surah_number
                        )?.name
                      }
                    </div>
                  </div>
                  <div className="flex gap-7 items-center">
                    <div>صفحة : {page}</div>
                    <div>اية : {verse.verse_number}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Search.propTypes = {
  onVerseClick: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default Search;
