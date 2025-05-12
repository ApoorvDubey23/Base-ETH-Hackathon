import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import FeaturedGames from '@/components/FeaturedGames';
import PopularNow from '@/components/PopularNow';
import RecentWinners from '@/components/RecentWinners';
import './index.css';

export default function HomePage() {
  return (
    <div className="root">
      <Head>
        <title>LuckyCasino - Online Casino Games</title>
        <meta
          name="description"
          content="Play exclusive casino games including Plinko, Limbo, Dice and more"
        />
      </Head>

      <Header />

      <main className="my-8">
        <HeroBanner />
        <FeaturedGames />
        <PopularNow />
        <RecentWinners />
      </main>

      <Footer />
    </div>
  );
}
