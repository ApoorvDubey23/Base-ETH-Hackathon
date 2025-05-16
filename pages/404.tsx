import React from "react";
import Link from "next/link";
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-7xl font-extrabold mb-4 tracking-wider text-transparent bg-clip-text 
                    bg-gradient-to-r from-purple-500 to-pink-600 dark:from-pink-400 dark:to-red-500 drop-shadow-2xl">
                    404
                </h1>
                <p className="text-2xl mb-8 max-w-md text-gray-800 dark:text-gray-200">
                    Oops, it seems you've ventured off the map.
                </p>
                <Link
                    href="/"
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 
                    rounded-md text-white font-semibold shadow-lg hover:shadow-2xl transition duration-300"
                >
                    Return Home
                </Link>
            </main>
            <Footer />
        </div>
    );
};

export default NotFoundPage;