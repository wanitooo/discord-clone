import { Link, Outlet } from "@tanstack/react-router";
import { Button } from "../components/shadcn/ui";
import { Separator } from "@radix-ui/react-menubar";

const Landing = () => {
  return (
    <div>
      <span>Welcome to the landing page</span>
      <Separator className="bg-slate-600" />
      <Button variant={"link"}>
        <Link to="/app">To app</Link>
      </Button>
      <Outlet />
    </div>
  );
};

export default Landing;
