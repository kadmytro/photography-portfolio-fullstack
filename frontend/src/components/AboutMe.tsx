import React from "react";

function AboutMe() {
  return (
    <div className="aboutMeContainer h-96 bg-secondary text-secondaryText place-content-center">
      <h2 className="font-normal m-auto pb-4 text-2xl text-center">About me</h2>
      <div className="aboutMeContent w-2/5 min-w-500px mx-auto center">
        Hi! I’m @kadmytro, a professional photographer from Ukraine...Lorem
        ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </div>
    </div>
  );
}

export default AboutMe;
