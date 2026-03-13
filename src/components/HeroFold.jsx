import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../theme/hero.css";
gsap.registerPlugin(ScrollTrigger);

export default function HeroFold({ onViewPositions, onContact }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const marquees = gsap.utils.toArray(".marquee");

      marquees.forEach((el, index) => {
        const track = el.querySelector(".track");

        const [xStart, xEnd] = index % 2 === 0 ? [-400, -1200] : [-400, 200];

        gsap.fromTo(
          track,
          { x: xStart },
          {
            x: xEnd,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "+=1200",
              scrub: 1,
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const lines = ["Leaders", "Innovators", "Changemakers"];

  return (
    <div ref={containerRef} className="hero-fold-wrapper">
      <div className="wrapper-3d">
        <div className="fold fold-top">
          <div className="fold-align">
            <div className="fold-content">
              {lines.map((text, i) => (
                <div key={i} className="marquee">
                  <div className="track">
                    {`${text}. ${text}. `}
                    <span className="-focus">{text}.</span>
                    {` ${text}. ${text}. ${text}.`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fold fold-center">
          <div className="fold-align">
            <div className="fold-content">
              {lines.map((text, i) => (
                <div key={i} className="marquee">
                  <div className="track">
                    {`${text}. ${text}. `}
                    <span className="-focus">{text}.</span>
                    {` ${text}. ${text}. ${text}.`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fold fold-bottom">
          <div className="fold-align">
            <div className="fold-content">
              {lines.map((text, i) => (
                <div key={i} className="marquee">
                  <div className="track">
                    {`${text}. ${text}. `}
                    <span className="-focus">{text}.</span>
                    {` ${text}. ${text}. ${text}.`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="hero-buttons">
        <button className="btn-grad" onClick={onViewPositions}>
          View Positions
        </button>

        <button className="btn-outline" onClick={onContact}>
          Contact Us
        </button>
      </div>
    </div>
  );
}
