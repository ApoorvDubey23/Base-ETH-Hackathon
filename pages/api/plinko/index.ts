import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import cors from "cors";
import { outcomes } from "@/utils/plinko/outcomes";

const TOTAL_DROPS = 16;
const MULTIPLIERS: { [key: number]: number } = {
  1: 5,
  2: 2,
  3: 1.5,
  4: 1.2,
  5: 1,
  6: 0.8,
  7: 0.5,
  8: 0.3,
  9: 0,
  10: 0.3,
  11: 0.5,
  12: 0.8,
  13: 1,
  14: 1.2,
  15: 1.5,
  16: 2,
  17: 5,
};

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