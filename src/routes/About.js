import React from "react";
import "../style/About.css";

function About(props) {
  console.log(props);
  return (
    <div className="about__container">
      <span>"Ctrl+C or Ctrl+V"</span>
      <span>- ASAC 3K -Danny</span>
    </div>
  );
}

export default About;
