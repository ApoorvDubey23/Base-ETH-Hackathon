import { useEffect, useRef, useState } from "react";
import { BallManager } from "@/utils/plinko/classes/BallManager";
import axios from "axios";
import { Button } from '@/components/ui/button';

export default function Game() {
  const baseURL = "http://localhost:3000"
  const [ballManager, setBallManager] = useState<BallManager>();
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement
      );
      setBallManager(ballManager);
    }
  }, [canvasRef]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center">
      <canvas ref={canvasRef} width="800" height="800"></canvas>
      
      <Button
        className="px-10 mb-4"
        onClick={async () => {
          const response = await axios.post(`${baseURL}/api/plinko`, {
        data: 1,
          });
          if (ballManager) {
        ballManager.addBall(response.data.point);
          }
        }}
      >
        Add ball
      </Button>
     

    </div>
  );
}
