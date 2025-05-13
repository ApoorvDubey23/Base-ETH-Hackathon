import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Quotes, Simulate } from "@/components/plinko";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  useEffect (() => {
    setCurrentTheme(theme)
    console.log(theme)
  },[theme])



  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <div className="flex flex-col lg:flex-row items-center justify-between m-5 p-5 rounded-md shadow-lg bg-gray-50 dark:bg-gray-800">
        <Simulate theme={currentTheme as "light"|| "dark"} />
        <Quotes />
      </div>
      <Footer />
    </div>
  );
}
