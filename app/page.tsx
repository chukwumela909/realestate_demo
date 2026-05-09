import TopNav from "./components/TopNav";
import Masthead from "./components/Masthead";
import Hero from "./components/Hero";
import Featured from "./components/Featured";
import MoodIndex from "./components/MoodIndex";
import Journal from "./components/Journal";
import Agents from "./components/Agents";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main id="top" className="flex-1">
      <TopNav />
      <Masthead />
      <Hero />
      <Featured />
      <MoodIndex />
      <Journal />
      <Agents />
      <Footer />
    </main>
  );
}
