import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0x18652D09cE9c14BFBd92954bDcE3802EFd5B31F0";

function App() {
  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); // Added state for network check

  // Check if the current network is the correct network
  useEffect(() => {
    async function checkNetwork() {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setIsCorrectNetwork(chainId === "0xaa36a7"); // Change to the correct chain ID
      }
    }
    //check for initial network
    checkNetwork();

    //Check for network change
    window.ethereum.on(
      "chainChanged",
      (newChainId) => {
        setIsCorrectNetwork(newChainId === "0xaa36a7"); // Change to the correct chain ID
      },
      []
    );
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    initNFTContract();
  }, [account]);

  async function connectWallet() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        const newAccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(newAccounts[0]);
      }
    } catch (error) {
      if (error.code === 4001) {
        // User rejected the request
        alert("User rejected the request to connect to the Ethereum network.");
      } else {
        alert("An error occurred while connecting to the Ethereum network.");
      }
    }
  }

  async function disconnectWallet() {
    if (window.ethereum) {
      try {
        setAccount(null);
      } catch (error) {
        console.error(
          "An error occurred while disconnecting the wallet:",
          error
        );
      }
    }
  }

  const data = [
    {
      url: "./assets/images/1.png",
      param:
        "handleMint('https://purple-rare-jay-548.mypinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/1.png')",
    },
    {
      url: "./assets/images/2.png",
      param:
        "handleMint('https://purple-rare-jay-548.mypinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/2.png')",
    },
    {
      url: "./assets/images/3.png",
      param:
        "handleMint('https://purple-rare-jay-548.mypinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/3.png')",
    },
    {
      url: "./assets/images/4.png",
      param:
        "handleMint('https://purple-rare-jay-548.mypinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/4.png')",
    },
    {
      url: "./assets/images/5.png",
      param:
        "handleMint('https://purple-rare-jay-548.mypinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/5.png')",
    },
  ];

  async function withdrawMoney() {
    try {
      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
  }

  if (!isCorrectNetwork) {
    return (
      <div className="container">
        <br />
        <h1>🔮 NFT Marketplace </h1>
        <h2>Switch to the Sepolia Network</h2>
        <p>Please switch to the Sepolia network to use this app.</p>
      </div>
    );
  }

  async function handleMint(tokenURI) {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther("0.01") };
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    } finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
    return (
      <>
        <div className="connect-container">
          <br />
          <h1>🔮 Metaschool</h1>
          <h2>NFT Marketplace</h2>
          <p>Buy an NFT from our marketplace.</p>

          {isWalletInstalled ? (
            <button className="connect-button" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="bg">
      <>
        <div className="container">
          <br />

          <h1>NFT Marketplace</h1>
          <p>A NFT Marketplace to view and mint your NFT</p>
          <p class="footer">
            Powered by{" "}
            <a
              class="ref-link"
              href="./"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kriswebchain
            </a>
            🔮
          </p>
          {data.map((item, index) => (
            <div className="imgDiv">
              <img
                src={item.url}
                key={index}
                alt="images"
                width={250}
                height={250}
                border={2}
              />
              <button
                className="mint_btn"
                isLoading={isMinting}
                onClick={() => {
                  handleMint(item.param);
                }}
              >
                Mint - 0.01 MATIC
              </button>
            </div>
          ))}
          <div className="withdraw_container">
            <button
              className="withdraw_btn"
              onClick={() => {
                withdrawMoney();
              }}
            >
              Withdraw Money from Contract
            </button>
          </div>
          <button className="disconnect-button" onClick={disconnectWallet}>
            Disconnect Wallet
          </button>
        </div>
      </>
    </div>
  );
}

export default App;
