// 'use client';
// import {
//   Children,
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { motion, useMotionValue } from 'framer-motion';
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import PropTypes from 'prop-types';

// const CarouselContext = createContext(undefined);

// function useCarousel() {
//   const context = useContext(CarouselContext);
//   if (!context) {
//     throw new Error('useCarousel must be used within an CarouselProvider');
//   }
//   return context;
// }

// function CarouselProvider({
//   children,
//   initialIndex = 0,
//   onIndexChange,
//   disableDrag = false,
// }) {
//   const [index, setIndex] = useState(initialIndex);
//   const [itemsCount, setItemsCount] = useState(0);

//   const handleSetIndex = (newIndex) => {
//     setIndex(newIndex);
//     onIndexChange?.(newIndex);
//   };

//   useEffect(() => {
//     setIndex(initialIndex);
//   }, [initialIndex]);

//   return (
//     <CarouselContext.Provider
//       value={{
//         index,
//         setIndex: handleSetIndex,
//         itemsCount,
//         setItemsCount,
//         disableDrag,
//       }}
//     >
//       {children}
//     </CarouselContext.Provider>
//   );
// }

// function Carousel({
//   children,
//   className,
//   initialIndex = 0,
//   index: externalIndex,
//   onIndexChange,
//   disableDrag = false,
// }) {
//   const [internalIndex, setInternalIndex] = useState(initialIndex);
//   const isControlled = externalIndex !== undefined;
//   const currentIndex = isControlled ? externalIndex : internalIndex;

//   const handleIndexChange = (newIndex) => {
//     if (!isControlled) {
//       setInternalIndex(newIndex);
//     }
//     onIndexChange?.(newIndex);
//   };

//   return (
//     <CarouselProvider
//       initialIndex={currentIndex}
//       onIndexChange={handleIndexChange}
//       disableDrag={disableDrag}
//     >
//       <div className={`group/hover relative ${className || ''}`}>
//         <div className='overflow-hidden'>{children}</div>
//       </div>
//     </CarouselProvider>
//   );
// }

// function CarouselNavigation({
//   className,
//   classNameButton,
//   alwaysShow,
// }) {
//   const { index, setIndex, itemsCount } = useCarousel();

//   return (
//     <div
//       className={`pointer-events-none absolute left-[-12.5%] top-1/2 flex w-[125%] -translate-y-1/2 justify-between px-2 ${className || ''}`}
//     >
//       <button
//         type='button'
//         className={`pointer-events-auto h-fit w-fit rounded-full bg-zinc-50 p-2 transition-opacity duration-300 dark:bg-zinc-950 ${
//           alwaysShow
//             ? 'opacity-100'
//             : 'opacity-0 group-hover/hover:opacity-100'
//         } ${
//           alwaysShow
//             ? 'disabled:opacity-40'
//             : 'disabled:group-hover/hover:opacity-40'
//         } ${classNameButton || ''}`}
//         disabled={index === 0}
//         onClick={() => {
//           if (index > 0) {
//             setIndex(index - 1);
//           }
//         }}
//       >
//         <FiChevronLeft
//           className='stroke-zinc-600 dark:stroke-zinc-50'
//           size={16}
//         />
//       </button>
//       <button
//         type='button'
//         className={`pointer-events-auto h-fit w-fit rounded-full bg-zinc-50 p-2 transition-opacity duration-300 dark:bg-zinc-950 ${
//           alwaysShow
//             ? 'opacity-100'
//             : 'opacity-0 group-hover/hover:opacity-100'
//         } ${
//           alwaysShow
//             ? 'disabled:opacity-40'
//             : 'disabled:group-hover/hover:opacity-40'
//         } ${classNameButton || ''}`}
//         disabled={index + 1 === itemsCount}
//         onClick={() => {
//           if (index < itemsCount - 1) {
//             setIndex(index + 1);
//           }
//         }}
//       >
//         <FiChevronRight
//           className='stroke-zinc-600 dark:stroke-zinc-50'
//           size={16}
//         />
//       </button>
//     </div>
//   );
// }

// function CarouselIndicator({
//   className,
//   classNameButton,
// }) {
//   const { index, itemsCount, setIndex } = useCarousel();

//   return (
//     <div
//       className={`absolute bottom-0 z-10 flex w-full items-center justify-center ${className || ''}`}
//     >
//       <div className='flex space-x-2'>
//         {Array.from({ length: itemsCount }, (_, i) => (
//           <button
//             key={i}
//             type='button'
//             aria-label={`Go to slide ${i + 1}`}
//             onClick={() => setIndex(i)}
//             className={`h-2 w-2 rounded-full transition-opacity duration-300 ${
//               index === i
//                 ? 'bg-zinc-950 dark:bg-zinc-50'
//                 : 'bg-zinc-900/50 dark:bg-zinc-100/50'
//             } ${classNameButton || ''}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// function CarouselContent({
//   children,
//   className,
//   transition,
// }) {
//   const { index, setIndex, setItemsCount, disableDrag } = useCarousel();
//   const [visibleItemsCount, setVisibleItemsCount] = useState(1);
//   const dragX = useMotionValue(0);
//   const containerRef = useRef(null);
//   const itemsLength = Children.count(children);

//   useEffect(() => {
//     if (!containerRef.current) {
//       return;
//     }

//     const options = {
//       root: containerRef.current,
//       threshold: 0.5,
//     };

//     const observer = new IntersectionObserver((entries) => {
//       const visibleCount = entries.filter(
//         (entry) => entry.isIntersecting
//       ).length;
//       setVisibleItemsCount(visibleCount);
//     }, options);

//     const childNodes = containerRef.current.children;
//     Array.from(childNodes).forEach((child) => observer.observe(child));

//     return () => observer.disconnect();
//   }, [children, setItemsCount]);

//   useEffect(() => {
//     if (!itemsLength) {
//       return;
//     }

//     setItemsCount(itemsLength);
//   }, [itemsLength, setItemsCount]);

//   const onDragEnd = () => {
//     const x = dragX.get();

//     if (x <= -10 && index < itemsLength - 1) {
//       setIndex(index + 1);
//     } else if (x >= 10 && index > 0) {
//       setIndex(index - 1);
//     }
//   };

//   return (
//     <motion.div
//       drag={disableDrag ? false : 'x'}
//       dragConstraints={
//         disableDrag
//           ? undefined
//           : {
//               left: 0,
//               right: 0,
//             }
//       }
//       dragMomentum={disableDrag ? undefined : false}
//       style={{
//         x: disableDrag ? undefined : dragX,
//       }}
//       animate={{
//         translateX: `-${index * (100 / visibleItemsCount)}%`,
//       }}
//       onDragEnd={disableDrag ? undefined : onDragEnd}
//       transition={
//         transition || {
//           damping: 18,
//           stiffness: 90,
//           type: 'spring',
//           duration: 0.2,
//         } 
//       }
//       className={`flex items-center ${!disableDrag ? 'cursor-grab active:cursor-grabbing' : ''} ${className || ''}`}
//       ref={containerRef}
//     >
//       {children}
//     </motion.div>
//   );
// }

// function CarouselItem({ children, className }) {
//   return (
//     <motion.div
//       className={`w-full min-w-0 shrink-0 grow-0 overflow-hidden ${className || ''}`}
//     >
//       {children}
//     </motion.div>
//   );
// }


// Carousel.propTypes = {
//   children: PropTypes.node.isRequired,
//   className: PropTypes.string,
//   initialIndex: PropTypes.number,
//   index: PropTypes.number,
//   onIndexChange: PropTypes.func,
//   disableDrag: PropTypes.bool,
// };

// CarouselNavigation.propTypes = {
//   className: PropTypes.string,
//   classNameButton: PropTypes.string,
//   alwaysShow: PropTypes.bool,
// };

// CarouselIndicator.propTypes = {
//   className: PropTypes.string,
//   classNameButton: PropTypes.string,
// };

// CarouselContent.propTypes = {
//   children: PropTypes.node.isRequired,
//   className: PropTypes.string,
//   transition: PropTypes.object,
// };

// CarouselItem.propTypes = {
//   children: PropTypes.node.isRequired,
//   className: PropTypes.string,
// };
// CarouselProvider.propTypes = {
//   children: PropTypes.node.isRequired,
//   initialIndex: PropTypes.number,
//   onIndexChange: PropTypes.func,
//   disableDrag: PropTypes.bool,
// };
// export {
//   Carousel,
//   CarouselContent,
//   CarouselNavigation,
//   CarouselIndicator,
//   CarouselItem,
//   useCarousel,
// };
