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
  const [focusInterval, setFocusInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isResting, setIsResting] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  let audioStop: boolean = false

  const formatTime = (time: number): string => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const startFocus = () => {
    setIsFocusing(true);
    setIsResting(false);
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
    setIsResting(true);
    setFocusTime(0);
  };

  const startRest = () => {
    setFocusInterval(
      setInterval(() => {
        setRestTime((prevRestTime) => {
          if (prevRestTime === 0 && audioStop === false) {
            if (audioRef.current) {
              audioRef.current.play();
            }
            audioStop = true
          }
          if (prevRestTime <= 0) {
            clearInterval(focusInterval!);
            setIsResting(false);
            return 0;
          }
          return prevRestTime - 1;
        });
      }, 1000)
    );
  };

  const handleClick = () => {
    if (isFocusing) {
      setShowPopup(true);
      if (focusInterval) {
        clearInterval(focusInterval);
      }
    } else {
      startFocus();
      if (audioRef.current) {
        audioRef.current.play();
      }
      audioStop = false
    }
  };

  const handleConfirm = () => {
    stopFocus();
    setShowPopup(false);
    startRest();
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
            className={` ${isFocusing ? `text-[#858585] bg-[#262626]` : `text-[#ffd8cc] bg-[#fa3e01]`} rounded-full p-4 px-24 font-bold`}
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
