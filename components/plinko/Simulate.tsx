import { BallManager } from "@/utils/plinko/classes/BallManager";
import { WIDTH } from "@/utils/plinko/constants";
import { pad } from "@/utils/plinko/padding";
import { useEffect, useRef, useState } from "react";

interface SimulateProps {
  theme: "light" | "dark";
}
export const Simulate = ({theme}:SimulateProps) => {

  const canvasRef = useRef<any>(null);
  let [outputs, setOutputs] = useState<{ [key: number]: number[] }>({
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

  async function simulate(ballManager: BallManager) {
    let i = 0;
    while (1) {
      i++;
      ballManager.addBall(pad(WIDTH / 2 + 20 * (Math.random() - 0.5)));
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement,theme,
        (index: number, startX?: number) => {
          setOutputs((outputs: any) => {
            return {
              ...outputs,
              [index]: [...(outputs[index] as number[]), startX],
            };
          });
        }
      );
      simulate(ballManager);

      return () => {
        ballManager.stop();
      };
    }
  }, [canvasRef,theme]);

  return (
    <div className="flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width="800" height="800"></canvas>
    </div>
  );
};
