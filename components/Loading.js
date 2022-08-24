import React from "react";
import { BeatLoader } from "react-spinners";
const Loading = () => {
  return (
    <aside className="loading-container">
      <BeatLoader size={50} color="#0090fc" />
    </aside>
  );
};

export default Loading;
