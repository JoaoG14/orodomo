"use client";

import React, { useState, useEffect, useRef } from "react";

const CustomPopup: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#262626] font-bold p-6 rounded-lg w-80 shadow-lg text-center">
        <p className="mb-4 text-white text-xl">
          Are you sure you want to stop your focus time?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-[#Fa3e01] text-[#FFD8CC] px-6 py-2 rounded-full"
            onClick={onConfirm}
          >
            Stop
          </button>
          <button className="text-[#858585] px-4 py-2 " onClick={onCancel}>
            Keep going
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
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [restStartTime, setRestStartTime] = useState<number | null>(null);
  const [totalRestTime, setTotalRestTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  let audioStop: boolean = false;

  const formatTime = (time: number): string => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const updateFocusTime = () => {
    if (focusStartTime) {
      const elapsed = Math.floor((Date.now() - focusStartTime) / 1000);
      setFocusTime(elapsed);
      setRestTime(Math.floor(elapsed / 4));
    }
  };

  const updateRestTime = () => {
    if (restStartTime) {
      const elapsed = Math.floor((Date.now() - restStartTime) / 1000);
      const remaining = Math.max(0, totalRestTime - elapsed);
      setRestTime(remaining);

      if (remaining === 0 && audioStop === false) {
        if (audioRef.current) {
          audioRef.current.play();
        }
        audioStop = true;
        setIsResting(false);
      }
    }
  };

  const startFocus = () => {
    setIsFocusing(true);
    setIsResting(false);
    setFocusStartTime(Date.now());
  };

  const stopFocus = () => {
    setIsFocusing(false);
    setIsResting(true);
    setFocusStartTime(null);
    setTotalRestTime(Math.floor(focusTime / 4));
    setRestStartTime(Date.now());
    setFocusTime(0);
  };

  const handleClick = () => {
    if (isFocusing) {
      setShowPopup(true);
    } else {
      startFocus();
      if (audioRef.current) {
        audioRef.current.play();
      }
      audioStop = false;
    }
  };

  const handleConfirm = () => {
    stopFocus();
    setShowPopup(false);
  };

  const handleCancel = () => {
    setShowPopup(false);
    startFocus();
  };

  useEffect(() => {
    let focusTimer: NodeJS.Timeout | null = null;
    let restTimer: NodeJS.Timeout | null = null;

    if (isFocusing) {
      focusTimer = setInterval(updateFocusTime, 1000);
    }

    if (isResting) {
      restTimer = setInterval(updateRestTime, 1000);
    }

    return () => {
      if (focusTimer) clearInterval(focusTimer);
      if (restTimer) clearInterval(restTimer);
    };
  }, [isFocusing, isResting, focusStartTime, restStartTime]);

  return (
    <main className="bg-black font-poppins  flex min-h-screen flex-col items-center text-center p-24">
      <div className="bg-[#262626] mt-36 px-2 items-center text-center align-middle justify-around w-48 h-12 rounded-full flex">
        <p
          className={`${
            isResting ? `text-[#858585]` : `text-[#FFD8CC]`
          } font-bold z-10 cursor-default`}
        >
          Focus
        </p>
        <p
          className={`${
            isResting ? `text-[#FFD8CC]` : `text-[#858585]`
          } font-bold z-10 cursor-default`}
        >
          Rest
        </p>
        <div
          className={`bg-[#FA3E01] h-9 rounded-full  absolute ${
            isResting ? `ml-[96px] w-20` : `mr-[82px] w-24`
          } block -2 z-0`}
        ></div>
      </div>

      <div
        id="mainTimer"
        className="text-center text-8xl font-extrabold m-4 text-white"
      >
        {formatTime(isResting ? restTime : focusTime)}
      </div>

      {isResting ? (
        <p className="text-[#828282] font-bold">Enjoy your resting time</p>
      ) : (
        <p className="text-[#828282] font-bold">Your rest time will be:</p>
      )}

      {!isResting && (
        <>
          <p id="restTimer" className="text-[#Fa3e01] font-extrabold py-3">
            {formatTime(restTime)}
          </p>
          <button
            className={`${
              isFocusing ? `text-[#858585] bg-[#262626]` : `text-[#ffd8cc] bg-[#fa3e01]`
            } rounded-full p-4 px-24 font-bold`}
            onClick={handleClick}
          >
            {isFocusing ? "Stop Focus" : "Start Focus"}
          </button>
        </>
      )}

      {showPopup && (
        <CustomPopup onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      <audio src="/bells.mp3" id="bell" ref={audioRef}></audio>
    </main>
  );
};

export default Home;
