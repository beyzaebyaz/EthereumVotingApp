export const contractABI = [
  {
    "inputs": [{ "internalType": "address[5]", "name": "_voters", "type": "address[5]" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "optionOne",
    "outputs": [{ "internalType": "uint72", "name": "", "type": "uint72" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "optionTwo",
    "outputs": [{ "internalType": "uint72", "name": "", "type": "uint72" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVotes",
    "outputs": [
      { "internalType": "uint72", "name": "", "type": "uint72" },
      { "internalType": "uint72", "name": "", "type": "uint72" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isVotingActive",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bool", "name": "voteForFirst", "type": "bool" }],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "voters",
    "outputs": [
      { "internalType": "address", "name": "addr", "type": "address" },
      { "internalType": "bool", "name": "hasVoted", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Bu adresi akıllı sözleşme deploy edildikten sonra güncelleyin
export const contractAddress = "0xF632d1aEc066A96dB405e2630525ae8c2ceE603c"; 