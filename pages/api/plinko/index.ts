import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import cors from "cors";
import { outcomes } from "@/utils/plinko/outcomes";

const TOTAL_DROPS = 16;
const MULTIPLIERS: {[ key: number ]: number} = {
    0: 16,
    1: 9,
    2: 2,
    3: 1.4,
    4: 1.4,
    5: 1.2,
    6: 1.1,
    7: 1,
    8: 0.5,
    9: 1,
    10: 1.1,
    11: 1.2,
    12: 1.4,
    13: 1.4,
    14: 2,
    15: 9,
    16: 16
}

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(cors());

router.post(async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    let outcome = 0;
    const pattern = []
    for (let i = 0; i < TOTAL_DROPS; i++) {
        if (Math.random() > 0.5) {
            pattern.push("R")
            outcome++;
        } else {
            pattern.push("L")
        }
    }

    const multiplier = MULTIPLIERS[outcome];
    const possiblieOutcomes = outcomes[outcome.toString() as keyof typeof outcomes];

    res.send({
                point: possiblieOutcomes[Math.floor(Math.random() * possiblieOutcomes.length || 0)],
                multiplier,
                pattern
            });

  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router.handler({
  onError: (err: unknown, _: NextApiRequest, res: NextApiResponse) => {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    console.error("API Error:", err);
    res.status(500).json({ error: errorMessage });
  },
});