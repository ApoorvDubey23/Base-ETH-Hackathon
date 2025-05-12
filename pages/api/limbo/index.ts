import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import cors from "cors";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(cors());

// POST endpoint for Limbo
router.post(async (req, res) => {
    try {
        // Read optional 'target' from request body (if provided)
        const { target } = req.body || {};

        // Generate a random multiplier between 1.01 and 50.00
        const randomValue = Math.random();
        const resultMultiplier = parseFloat((1.01 + randomValue * (50 - 1.01)).toFixed(2));

        // Determine win status if a target multiplier is provided
        const win = target ? resultMultiplier >= target : undefined;

        res.send({
            multiplier: resultMultiplier,
            ...(win !== undefined && { win }),
            // Additional fields (e.g., message) can be added here
        });
    } catch (error) {
        console.error("Error generating Limbo outcome:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router.handler({
    onError: (err: unknown, req: NextApiRequest, res: NextApiResponse) => {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        console.error("Limbo API Error:", err);
        res.status(500).json({ error: errorMessage });
    },
});