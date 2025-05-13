import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Quotes, Simulate } from "@/components/plinko";
import { BallManager } from "@/utils/plinko/classes/BallManager";
import { WIDTH } from "@/utils/plinko/constants";
import { pad } from "@/utils/plinko/padding";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [outputs, setOutputs] = useState<{ [key: number]: number[] }>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
  });
  const { theme } = useTheme();
  console.log(theme); 

  //   while (true) {
  //     ballManager.addBall(pad(WIDTH / 2 + 20 * (Math.random() - 0.5)));
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //   }
  // }
  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const ballManager = new BallManager(
  //       canvasRef.current,
  //       theme as "dark" | "light",
  //       (index: number, startX?: number) => {
  //         setOutputs((prev) => ({
  //           ...prev,
  //           [index]: [...(prev[index] || []), ...(startX !== undefined ? [startX] : [])],
  //         }));
  //       }
  //     );
  //     simulate(ballManager);
  //     return () => {
  //       ballManager.stop();
  //     };
  //   }
  // }, []);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <div className="flex flex-col lg:flex-row items-center justify-between m-5 p-5 rounded-md shadow-lg bg-gray-50 dark:bg-gray-800">
        <Simulate theme={theme as "light"|| "dark"} />
        <Quotes />
      </div>
      <Footer />
    </div>
  );
}
