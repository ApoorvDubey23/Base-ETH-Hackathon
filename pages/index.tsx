import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import FeaturedGames from '@/components/FeaturedGames';
import PopularNow from '@/components/PopularNow';
import RecentWinners from '@/components/RecentBets';
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Head>
        <title>MetaBet - Online Casino Games</title>
        <meta
          name="description"
          content="Play exclusive casino games including Plinko, Limbo, Dice and more"
        />
      </Head>

      <Header />

      <main className="my-8 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <HeroBanner />
        <FeaturedGames />
        <div id="popular-now">
          <PopularNow />
        </div>
        <RecentWinners />
      </main>

      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}
