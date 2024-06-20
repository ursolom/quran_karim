import React, { useEffect, useRef } from "react";

const MouseAnimation = () => {
  const svgContainerRef = useRef(null);

  useEffect(() => {
    const svgContainer = svgContainerRef.current;
    let previousX, previousY;

    const handleMouseMove = (e) => {
      const rect = svgContainer.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (previousX && previousY) {
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", previousX);
        line.setAttribute("y1", previousY);
        line.setAttribute("x2", currentX);
        line.setAttribute("y2", currentY);
        line.setAttribute("stroke", "#047857");
        line.setAttribute("stroke-width", "5");
        line.style.borderRadius = "5px";
        line.style.strokeLinecap = "round";

        line.addEventListener("mouseenter", () => {
          line.style.transform = "scale(1.5)";
          line.style.transition = "transform 0.5s ease";
        });

        line.addEventListener("mouseleave", () => {
          line.style.transform = "scale(1)";
        });

        svgContainer.appendChild(line);

        setTimeout(() => {
          line.style.transform = `translate(${currentX}px, ${currentY}px) scale(0)`;
          line.style.transition = "transform 0.5s ease-in-out";
          line.addEventListener("transitionend", () => {
            svgContainer.removeChild(line);
          });
        }, 50);
      }

      previousX = currentX;
      previousY = currentY;
    };

    const addMouseMoveListener = () => {
      document.addEventListener("mousemove", handleMouseMove);
    };

    const removeMouseMoveListener = () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };

    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const handleMediaQueryChange = (e) => {
      if (e.matches) {
        removeMouseMoveListener();
      } else {
        addMouseMoveListener();
      }
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    if (!mediaQuery.matches) {
      addMouseMoveListener();
    }

    return () => {
      removeMouseMoveListener();
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <div className="mouse">
      <svg
        ref={svgContainerRef}
        id="svg-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </div>
  );
};

export default MouseAnimation;
