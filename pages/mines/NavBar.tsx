import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Avatar, Modal } from "antd";
import { History, LogOut } from "lucide-react";
import SideBar from "./SideBar";

// Extend the Window interface to include the leap property
declare global {
  interface Window {
    leap: {
      getKey: (chainId: string) => Promise<{ bech32Address: string }>;
      enable: (chainId: string) => Promise<void>;
    };
  }
}
interface Network {
    chain_id: string;
    chain_uid: string;
    logo: string;
  }

  interface NavbarProps {
    Token: string | null;
    settoken: (token: string | null) => void;
    Address: string | null;
    setAddress: (address: string | null) => void;
    network: Network | null;
    setNetwork: (network: Network | null) => void;
  }


  const Navbar: React.FC<NavbarProps> = ({
    Token,
    settoken,
    Address,
    setAddress,
    network,
    setNetwork,
  }) => {
    const [networks, setNetworks] = useState<Network[]>([]);
    const [Tokens, settokens] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);


    useEffect(() => {
        const storedAddress = window.sessionStorage.getItem("address");
        if (storedAddress) {
          setAddress(storedAddress);
        }
      }, [setAddress]);

      const showModal = () => setIsModalOpen(true);
      const handleCancel = () => setIsModalOpen(false);

      const fetchTokens = async (chainuid: string) => {
        const payload = {
          query: `
            query Factory($chainUid: String!) {
              factory(chain_uid: $chainUid) {
                all_tokens {
                  tokens
                }
              }
            }
          `,
          variables: { chainUid: chainuid },
        };

        try {
          const response = await axios.post(
            "https://testnet.api.euclidprotocol.com/graphql",
            payload,
            { headers: { "Content-Type": "application/json" } }
          );
          const tokens = response.data.data.factory.all_tokens.tokens;
          settokens(tokens);
          return tokens;
        } catch (error) {
          console.error("Error fetching tokens:", error);
          return null;
        }
      };

      const fetchNetworks = async () => {
        try {
          const data = await axios.get(
            "https://testnet.api.euclidprotocol.com/api/v1/chains"
          );
          setNetworks(data?.data);
          showModal();
        } catch (error) {
          console.error("Error fetching networks:", error);
        }
      };

      const checkLeapWallet = async () => {
        if (typeof window.leap !== "undefined") {
          return true;
        } else {
          toast.error("Leap Wallet not installed");
          return false;
        }
      };

      const connectWallet = async () => {
        const leapAvailable = await checkLeapWallet();
        if (!leapAvailable) return;

        if (!network || !network.chain_id || !network.chain_uid) {
          toast.error("Network details missing. Please select a network.");
          return;
        }

        try {
          const key = await window.leap.getKey(network.chain_id);
          setAddress(key.bech32Address);
          window.sessionStorage.setItem("address", key.bech32Address);
          window.sessionStorage.setItem("chain_id", network.chain_id);
          window.sessionStorage.setItem("chain_uid", network.chain_uid);

          await window.leap.enable(network.chain_id);
        } catch (error) {
          console.error("Error connecting to Leap Wallet:", error);
          toast.error("Failed to connect to Leap Wallet");
        }
      };

      const logout = () => {
        window.sessionStorage.clear();
        setAddress(null);
        setNetwork(null);
        settoken(null);
        toast.success("Logged out successfully");
      };

      return (
        <nav className="sticky top-0 z-10 w-full text-white bg-gray-800 shadow-md">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700">
                  ChainGamble
                </div>
              </div>
              <div className="items-center hidden space-x-4 sm:flex">
                <SideBar />
                {Address ? (
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-white transition-all bg-red-800 rounded-md hover:bg-red-600"
                  >
                    <LogOut className="h-[20px]" />
                    Logout
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 text-white transition-all bg-blue-800 rounded-md hover:bg-blue-600"
                    onClick={() => fetchNetworks()}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>

          <Modal
            title={<div style={{ color: "#F6E05E", fontSize: "1.25rem", fontWeight: "bold", textAlign: "center" }}>Select Network</div>}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            centered
            styles={{ body: { padding: "20px", backgroundColor: "#1F2937", borderRadius: "8px" } }}
          >
            <div className="space-y-4">
              {networks?.map((network, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    setNetwork(network);
                    handleCancel();
                    fetchTokens(network.chain_uid);
                    setIsModalOpen2(true);
                  }}
                >
                  <Avatar src={network.logo} className="mr-3" />
                  <div>
                    <p className="font-semibold text-white">{network.chain_uid}</p>
                    <p className="text-sm text-gray-400">Chain ID: {network.chain_id}</p>
                  </div>
                </div>
              ))}
            </div>
          </Modal>

          <Modal
            title={
              <div style={{ color: "#F6E05E", fontSize: "1.25rem", fontWeight: "bold", textAlign: "center" }}>
                Select Token
              </div>
            }
            open={isModalOpen2}
            onCancel={() => setIsModalOpen2(false)}
            footer={null}
            centered
            className="bg-black bg-opacity-25 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[6.5px] rounded-lg border border-white border-opacity-20 p-6"
          >
            <div className="space-y-4">
              {Tokens?.map((token, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    settoken(token);
                    window.sessionStorage.setItem("token", token);
                    setIsModalOpen2(false);
                    connectWallet();
                  }}
                >
                  <p className="font-semibold text-white">{token}</p>
                </div>
              ))}
            </div>
          </Modal>
        </nav>
      );
  };

export default Navbar;