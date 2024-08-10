import { Link, Outlet } from "@tanstack/react-router";
import { Button } from "../components/shadcn/ui";

const Landing = () => {
  // TODO: Add floating thingies
  return (
    <div className="landing-bg">
      {/* Navbar */}
      <div className="w-full h-16 bg-transparent flex flex-row justify-evenly items-center py-6">
        <div className="font-gintoNord font-bold">NotDiscord</div>

        <div className="font-ggSans font-semibold flex flex-row justify-between gap-10 ">
          <a href="/" className="hover:underline">
            About
          </a>
        </div>

        <Button className="rounded-3xl hover:text-[#5155ce]">
          <Link to="/app">Open NOTDiscord</Link>
        </Button>
      </div>
      <section id="introduction">
        <div className="flex w-full flex-col items-center">
          <div className="w-1/2 flex flex-row items-center pt-32 ">
            <div className="w-2/5">
              <h1 className="z-10 text-5xl font-gintoNord font-bold uppercase">
                Group chat that’s all fun and games
              </h1>
              <p className="text-xl font-ggSans font-semibold">
                NOT Discord is a porfolio project by Juan Francisco Santos that
                includes features such as realtime messaging, voice channels,
                share screens and more.
              </p>
            </div>

            <div className="w-3/5">
              <img
                src="images/landing-computer.png"
                // alt="Image by Kampus on Freepik"
              />
            </div>
          </div>
          <div className="w-full flex justify-center gap-10">
            <Button
              variant={"default"}
              className="rounded-3xl cursor-not-allowed"
              disabled
              size={"lg"}
            >
              <Link to="/app">Download NOTDiscord</Link>
            </Button>

            <Button
              className="rounded-3xl text-white bg-[#161CBB] hover:bg-[#161CBB] hover:shadow-xl transition-shadow scale-110 "
              size={"lg"}
            >
              <Link to="/app">Open NOTDiscord in your browser</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="nextsection" className="pb-28">
        <div className="flex w-full flex-col items-center">
          <div className="w-1/2 flex flex-row items-center pt-32 ">
            <div className="w-2/5">
              <h1 className="z-10 text-5xl font-gintoNord font-bold uppercase">
                Group chat that’s all fun and games
              </h1>
              <p className="text-xl font-ggSans font-semibold">
                NOT Discord is a porfolio project by Juan Francisco Santos that
                includes features such as realtime messaging, voice channels,
                share screens and more.
              </p>
            </div>

            <div className="w-3/5">
              <img
                src="images/landing-computer.png"
                // alt="Image by Kampus on Freepik"
              />
            </div>
          </div>
          <div className="w-full flex justify-center gap-10">
            <Button
              variant={"default"}
              className="rounded-3xl cursor-not-allowed"
              disabled
              size={"lg"}
            >
              <Link to="/app">Download NOTDiscord</Link>
            </Button>

            <Button
              className="rounded-3xl text-white bg-[#161CBB] hover:bg-[#161CBB] hover:shadow-xl transition-shadow scale-110 "
              size={"lg"}
            >
              <Link to="/app">Open NOTDiscord in your browser</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
