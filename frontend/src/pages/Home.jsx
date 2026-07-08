import Hero from "../components/Hero";
import Stats from "../components/Stats";
import DashboardCards from "../components/DashboardCards";
export default function Home() {
  return (
    <div className="space-y-8">

      <Hero />
     <Stats />
     <DashboardCards/>
    </div>
  );
}