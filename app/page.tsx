"use client"

import React, { useState, useEffect } from "react";

const CustomPopup: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <p className="mb-4">Are you sure you want to stop the focus timer?</p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [focusTime, setFocusTime] = useState<number>(0);
  const [restTime, setRestTime] = useState<number>(0);
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const [focusInterval, setFocusInterval] = useState<NodeJS.Timeout | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const formatTime = (time: number): string => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const startFocus = () => {
    setIsFocusing(true);
    setFocusInterval(
      setInterval(() => {
        setFocusTime((prevFocusTime) => {
          const newFocusTime = prevFocusTime + 1;
          setRestTime(Math.floor(newFocusTime / 4));
          return newFocusTime;
        });
      }, 1000)
    );
  };

  const stopFocus = () => {
    if (focusInterval) {
      clearInterval(focusInterval);
    }
    setIsFocusing(false);
  };

  const handleClick = () => {
    if (isFocusing) {
      setShowPopup(true);
      if (focusInterval) {
        clearInterval(focusInterval);
      }
    } else {
      startFocus();
    }
  };

  const handleConfirm = () => {
    stopFocus();
    setShowPopup(false);
  };

  const handleCancel = () => {
    setShowPopup(false);
    startFocus(); // Restart the timer if canceled
  };

  useEffect(() => {
    return () => {
      if (focusInterval) {
        clearInterval(focusInterval);
      }
    };
  }, [focusInterval]);

  return (
    <main className="bg-black font-poppins flex min-h-screen flex-col items-center text-center p-24">
      <div className="bg-[#262626] px-2 items-center text-center align-middle justify-around w-48 h-12 rounded-full flex">
        <p className="text-[#FFD8CC] font-bold z-10 cursor-default">Focus</p>
        <p className="text-[#858585] font-bold z-10 cursor-default">Rest</p>
        <div className="bg-[#FA3E01] h-9 rounded-full w-24 absolute mr-[82px] block -2 z-0"></div>
      </div>

      <div
        id="mainTimer"
        className="text-white text-8xl text-center font-extrabold m-4"
      >
        {formatTime(focusTime)}
      </div>

      <p className="text-[#828282] font-bold">
        Your <span className="text-[#fA3E01]">rest</span> time will be:
      </p>
      <p id="restTimer" className="text-[#Fa3e01] font-extrabold py-3">
        {formatTime(restTime)}
      </p>

      <button
        className="text-[#ffd8cc] bg-[#fa3e01] rounded-full p-4 px-28 font-bold"
        onClick={handleClick}
      >
        {isFocusing ? "Stop Focus" : "Start Focus"}
      </button>

      {showPopup && (
        <CustomPopup onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </main>
  );
};

export default Home;
