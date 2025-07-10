import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "./contracts/Voting";
import "./App.css"; 
import Navbar from "./components/Navbar";

// Seçenek bilgileri
const options = {
  One: {
    name: "Aday 1",
    image: "/aday1.png"
  },
  Two: {
    name: "Aday 2",
    image: "/aday2.png"
  }
};

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [votes, setVotes] = useState({ One: 0, Two: 0 });
  const [isOwner, setIsOwner] = useState(false);
  const [isVoter, setIsVoter] = useState(false);
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setIsOwner(false);
    setIsVoter(false);
    setIsVotingActive(false);
    setLoading(false);
    setStatusMsg("");
    setShowResults(false);
  };

  const checkVoterStatus = async (contractInstance, address) => {
    try {
      console.log("Checking voter status for address:", address);
      
      // Tüm seçmenleri kontrol et
      let i = 0;
      while (true) {
        try {
          const voter = await contractInstance.voters(i);
          console.log(`Checking voter ${i}:`, voter.addr);
          
          if (voter.addr.toLowerCase() === address.toLowerCase()) {
            console.log("Voter found! Has voted:", voter.hasVoted);
            return true;
          }
          i++;
        } catch (err) {
          // Array sınırına ulaştık
          break;
        }
      }
      
      console.log("Voter not found in the list");
      return false;
    } catch (err) {
      console.error("Seçmen kontrolü hatası:", err);
      return false;
    }
  };

  const updateAccountInfo = async (selectedAccount) => {
    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

      const [ownerAddress, active] = await Promise.all([
        contractInstance.owner(),
        contractInstance.isVotingActive()
      ]);

      const isVoterStatus = await checkVoterStatus(contractInstance, selectedAccount);

      setAccount(selectedAccount);
      setContract(contractInstance);
      setIsOwner(selectedAccount.toLowerCase() === ownerAddress.toLowerCase());
      setIsVoter(isVoterStatus);
      setIsVotingActive(active);
      setLoading(false);
      setStatusMsg("");

      await fetchVotes(contractInstance);
    } catch (error) {
      console.error("Hesap bilgileri güncellenirken hata:", error);
      setStatusMsg("Bağlantı hatası: " + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchAccount = async () => {
    if (!window.ethereum) {
      alert("MetaMask yüklü değil!");
      return;
    }

    try {
      setIsConnecting(true);
      // MetaMask'ı aç ve hesap seçimini zorla
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });

      // Yeni hesabı al
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("Hesap seçilmedi!");
      }

      await updateAccountInfo(accounts[0]);
    } catch (error) {
      console.error("MetaMask hesap değiştirme hatası:", error);
      if (error.code === 4001) {
        setStatusMsg("İzin reddedildi. Hesap değiştirme iptal edildi.");
      } else {
        setStatusMsg("Hesap değiştirme başarısız: " + error.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask yüklü değil!");
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("Hesap bağlantısı başarısız!");
      }

      await updateAccountInfo(accounts[0]);
    } catch (error) {
      console.error("Bağlantı hatası:", error);
      setStatusMsg("Bağlantı başarısız: " + error.message);
      setLoading(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const vote = async (voteForOne) => {
    if (!isVoter) {
      setStatusMsg("Oy kullanma yetkiniz yok! Sadece kayıtlı seçmenler oy kullanabilir.");
      return;
    }
    
    setStatusMsg("Oy kullanılıyor...");
    try {
      console.log("Attempting to vote with address:", account);
      const tx = await contract.vote(voteForOne);
      await tx.wait();
      setStatusMsg("Oy başarıyla kaydedildi!");
      fetchVotes();
    } catch (err) {
      console.error("Voting error:", err);
      const errorMessage = err.reason || err.message;
      setStatusMsg("Hata: " + errorMessage);
    }
  };

  const endVoting = async () => {
    setStatusMsg("Oylama sonlandırılıyor...");
    try {
      const tx = await contract.endVoting();
      await tx.wait();
      setIsVotingActive(false);
      setStatusMsg("Oylama başarıyla kapatıldı!");
    } catch (err) {
      console.error(err);
      // Smart contract'tan dönen hata mesajını göster
      const errorMessage = err.reason || err.message;
      setStatusMsg(errorMessage);
    }
  };

  const fetchVotes = async (instance = contract) => {
    if (!instance) return;
    try {
      const [one, two] = await instance.getVotes();
      setVotes({ One: parseInt(one), Two: parseInt(two) });
    } catch (err) {
      console.error("Oy bilgileri alınamadı:", err);
      const errorMessage = err.reason || err.message;
      setStatusMsg(errorMessage);
    }
  };

  useEffect(() => {
    connectWallet();

    const handleAccountsChanged = async (newAccounts) => {
      if (newAccounts.length === 0) {
        disconnectWallet();
      } else {
        await updateAccountInfo(newAccounts[0]);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const OptionCard = ({ id, data, voteFunction }) => (
    <div className="candidate-card">
      <div className="candidate-image">
        <img src={data.image} alt={data.name} />
      </div>
      <div className="candidate-info">
        <h3>{data.name}</h3>
        <div className="candidate-stats">
          <span className="vote-count">
            <span className="vote-icon">🗳️</span>
            {votes[id]} oy
          </span>
        </div>
      </div>
      <button 
        className="btn green" 
        style={{backgroundColor: "#00FF00", color: "white"}}
        onClick={voteFunction}
        disabled={!isVotingActive || loading}
      >
         OY VER
      </button>
    </div>
  );

  const ResultsModal = () => {
    if (!showResults) return null;

    const total = votes.One + votes.Two;
    const percentageOne = total === 0 ? 0 : (votes.One / total) * 100;
    const percentageTwo = total === 0 ? 0 : (votes.Two / total) * 100;

    return (
      <div className="modal-container">
        <div className="modal-overlay" onClick={() => setShowResults(false)} />
        <div className="results-modal">
          <div className="modal-header">
            <h3>📊 Oylama Sonuçları</h3>
            <button className="close-btn" onClick={() => setShowResults(false)}>×</button>
          </div>
          <div className="results-content">
            <div className="result-candidate">
              <img src={options.One.image} alt={options.One.name} className="result-candidate-image" />
              <div className="result-bar">
                <div className="bar-label">{options.One.name}</div>
                <div className="bar-container">
                  <div className="bar blue" style={{ width: `${percentageOne}%` }} />
                </div>
                <div className="bar-value">{votes.One} oy ({percentageOne.toFixed(1)}%)</div>
              </div>
            </div>

            <div className="result-candidate">
              <img src={options.Two.image} alt={options.Two.name} className="result-candidate-image" />
              <div className="result-bar">
                <div className="bar-label">{options.Two.name}</div>
                <div className="bar-container">
                  <div className="bar red" style={{ width: `${percentageTwo}%` }} />
                </div>
                <div className="bar-value">{votes.Two} oy ({percentageTwo.toFixed(1)}%)</div>
              </div>
            </div>

            <div className="total-votes">
              Toplam: {total} oy
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="container">
      <div className="loading-message">
        ⏳ {isConnecting ? "Bağlanıyor..." : "Yükleniyor..."}
      </div>
    </div>
  );

  return (
    <div className="app">
      <Navbar 
        account={account}
        isOwner={isOwner}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        onSwitchAccount={switchAccount}
        isDisconnected={!account}
      />
      
      <div className="container">
        {account ? (
          <>
            {statusMsg && (
              <div className={`status-message ${statusMsg.toLowerCase().includes("hata") ? "error" : "success"}`}>
                {statusMsg}
              </div>
            )}

            <div className="status-bar">
              <div className="voting-status">
                Oylama Durumu: {isVotingActive ? "🟢 Aktif" : "🔴 Kapalı"}
              </div>
              <div className="voter-status">
                Seçmen Durumu: {isVoter ? "✅ Oy kullanabilirsiniz" : "❌ Oy kullanma yetkiniz yok"}
              </div>
            </div>

            <div className="candidates-container">
              <OptionCard 
                id="One"
                data={options.One}
                voteFunction={() => vote(true)}
              />
              <OptionCard 
                id="Two"
                data={options.Two}
                voteFunction={() => vote(false)}
              />
            </div>

            <div className="action-buttons">
              <button className="btn orange" onClick={() => setShowResults(true)}>
                📊 Sonuçları Göster
              </button>
              {isVotingActive && (
                <button className="btn red" onClick={endVoting}>
                  🔒 Oylamayı Sonlandır
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="card welcome-card">
            <h2>👋 Blockchain Seçim Sistemine Hoş Geldiniz</h2>
            <p>Sistemi kullanmak için lütfen MetaMask'a bağlanın.</p>
          </div>
        )}
      </div>

      <ResultsModal />
    </div>
  );
}

export default App;