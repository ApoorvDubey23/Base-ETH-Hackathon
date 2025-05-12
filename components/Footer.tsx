import React from 'react';
import Link from 'next/link';
import { Dices } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 pt-12 pb-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Dices className="h-6 w-6 text-blue-500 dark:text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                MetaBet
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Experience the thrill of online gambling with our range of exciting games.
              Play responsibly.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-4">Games</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/limbo" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Limbo
                </Link>
              </li>
              <li>
                <Link href="/plinko" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Plinko
                </Link>
              </li>
              <li>
                <Link href="/Dicegame" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Dice
                </Link>
              </li>
              <li>
                <Link href="/mines" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Mines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Responsible Gaming
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Email Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Live Chat
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-300 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 MetaBet. All rights reserved. Gambling can be addictive. Play responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
