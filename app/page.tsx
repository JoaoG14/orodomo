export default function Home() {
  return (
    <main className="bg-black flex min-h-screen flex-col items-center text-center  p-24">
      <div className="bg-[#262626] px-2 items-center text-center align-middle justify-around w-48 h-12 rounded-full flex ">
        <p className="text-[#262626] font-bold z-10 cursor-default">Focus</p>
        <p className="text-[#858585] font-bold z-10 cursor-default">Rest</p>
        <div className="bg-[#FA3E01] h-9 rounded-full w-24 absolute mr-[82px] block -2 z-0"></div>
      </div>

      <div className="text-white text-8xl text-center  m-4">00:00</div>
    </main>
  );
}
