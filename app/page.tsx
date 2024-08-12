export default function Home() {
  return (
    <main className="bg-black font-poppins flex min-h-screen flex-col items-center text-center  p-24">
      <div className="bg-[#262626] px-2 items-center text-center align-middle justify-around w-48 h-12 rounded-full flex ">
        <p className="text-[#FFD8CC] font-bold z-10 cursor-default">Focus</p>
        <p className="text-[#858585] font-bold z-10 cursor-default">Rest</p>
        <div className="bg-[#FA3E01] h-9 rounded-full w-24 absolute mr-[82px] block -2 z-0"></div>
      </div>

      <div className="text-white text-8xl text-center font-extrabold m-4">
        00:00
      </div>

      <p className="text-[#828282] font-bold">
        Your <span className="text-[#fA3E01]">rest</span> time will be:
      </p>
      <p className="text-[#Fa3e01] font-extrabold py-3">00:00</p>
      <button className="text-[#ffd8cc] bg-[#fa3e01] rounded-full p-4 px-28 font-bold">
        Start Focus
      </button>
    </main>
  );
}
