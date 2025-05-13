  import { useRouter } from "next/router";
  import { Button } from "@/components/ui/button";

  export const Quotes = () => {
    const router = useRouter();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-8 py-10">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Play Plinko, Earn More!
          </h1>
          <p className="text-lg md:text-xl mb-8 leading-relaxed">
            Plinko lets players drop a ball from the top of our triangular pin pyramid to find the winning route down to a corresponding multiplier.
            Inspired by the Japanese mechanical game known as Pachinko, Plinko provides players with the ability to customise their risk factor and multipliers,
            ensuring this Stake Original game is suited for everyone at our online casino!
          </p>
          <Button
            className="px-8 py-3 font-semibold rounded-md bg-green-500 hover:bg-green-600 text-white transition-colors"
            onClick={() => router.push("/plinko/game")}
          >
            Play Plinko
          </Button>
        </div>
      </div>
    );
  };
