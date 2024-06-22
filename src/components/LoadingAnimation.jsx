import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const LoadingAnimation = () => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const loader = loaderRef.current;

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(loader, {
      rotation: 360,
      duration: 1.5,
      transformOrigin: "center",
      ease: "linear",
    });

    return () => tl.kill();
  }, []);

  return (
    <div className="size-full z-50 relative  flex justify-center items-center">
      <span
        ref={loaderRef}
        className="relative left-0 md:size-11 size-6 border-4 border-transparent rounded-full "
        style={{
          borderTopColor: "#FF3D00",
          animation: "spin 1s linear infinite",
        }}
      ></span>
    </div>
  );
};

export default LoadingAnimation;
