import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { BallManager } from "@/utils/plinko/classes/BallManager"

export function Game() {
    const [ballManager, setBallManager] = useState<BallManager>()
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            const manager = new BallManager(canvasRef.current)
            setBallManager(manager)
        }
    }, [])

    return (
        <div className="game-container light-theme">
            <canvas
                className="game-canvas"
                ref={canvasRef}
                width="800"
                height="800"
            />
            <button
                className="game-button"
                onClick={async () => {
                    const response = await axios.post("http://localhost:3000/game", {
                        data: 1,
                    })
                    if (ballManager) {
                        ballManager.addBall(response.data.point)
                    }
                }}
            >
                Add ball
            </button>
        </div>
    )
}