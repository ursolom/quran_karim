
import { useState,  useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Content from "../components/Content";
import LoadingAnimation from "../components/LoadingAnimation";

const Fahras = lazy(() => import("../components/Fahras"));
const Search = lazy(() => import("../components/Search"));

export default function Home() {
  const [isContentActive, setIsContentActive] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isBookmarkSaved, setIsBookmarkSaved] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFahrasVisible, setIsFahrasVisible] = useState(false);

  const toggleContent = useCallback(() => {
    setIsContentActive((prev) => !prev);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSearch = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleFahrasToggle = useCallback(() => {
    setIsFahrasVisible((prev) => !prev);
  }, []);

  const handleSurahClick = useCallback((startPage) => {
    setCurrentPage(startPage);
    setIsFahrasVisible(false);
  }, []);

  const hideFahras = useCallback(() => {
    setIsFahrasVisible(false);
  }, []);

  const toggleSearchVisibility = useCallback(() => {
    setIsSearchVisible((prev) => !prev);
  }, []);

  const hideSearch = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  const handleSaveBookmark = useCallback(() => {
    localStorage.setItem("bookmark", currentPage);
    setIsBookmarkSaved(true);
    setTimeout(() => setIsBookmarkSaved(false), 2000);
  }, [currentPage]);

  const headerVariants = {
    visible: { right: 0 },
    hidden: { right: "-100%" },
  };

  const footerVariants = {
    visible: { right: 0 },
    hidden: { right: "-100%" },
  };

  const fahrasVariants = {
    visible: { left: 0 },
    hidden: { left: "-100%" },
  };

  const searchVariants = {
    visible: { left: 0 },
    hidden: { left: "-100%" },
  };

  return (
    <>
      <AnimatePresence>
        {isFahrasVisible && (
          <motion.div
            className="absolute w-full h-full overflow-x-hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fahrasVariants}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="absolute top-0 z-50 w-full h-full bg-white">
              <Suspense fallback={<LoadingAnimation />}>
                <Fahras onSurahClick={handleSurahClick} onGoBack={hideFahras} />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            className="absolute top-0 z-50 w-full h-full bg-white"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={searchVariants}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Suspense fallback={<LoadingAnimation />}>
              <Search onVerseClick={handlePageChange} onHide={hideSearch} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-[100%] h-[100vh] overflow-hidden absolute">
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100vh",
          }}
          initial="visible"
          animate={isContentActive ? "hidden" : "visible"}
          variants={headerVariants}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {!isBookmarkSaved && (
            <Header
              isContentActive={isContentActive}
              onPageSearch={handlePageSearch}
              onSaveBookmark={handleSaveBookmark}
              currentPage={currentPage}
              toggleFahrasVisibility={handleFahrasToggle}
              toggleSearchVisibility={toggleSearchVisibility}
            />
          )}
        </motion.div>
      </div>
      <Content
        isContentActive={isContentActive}
        toggleContent={toggleContent}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        onPageSearch={handlePageSearch}
        onSaveBookmark={handleSaveBookmark}
      />
      <div className="w-[100%] h-[100vh] right-0 bottom-0 overflow-x-hidden absolute">
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "100vh",
          }}
          initial="visible"
          animate={isContentActive ? "hidden" : "visible"}
          variants={footerVariants}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {!isBookmarkSaved && (
            <Footer
              isContentActive={isContentActive}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </motion.div>
      </div>
    </>
  );
}
