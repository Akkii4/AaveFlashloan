const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const arbitrageToken = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c";
const flashloanContractAddress = "";
const arbitrageAddress = "";
const arbitrageABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minRequiredFunds",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "doer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "doerBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountDone",
        type: "uint256",
      },
    ],
    name: "ArbitrageCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "minRequiredFunds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    name: "performArbitrage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minRequiredFunds",
        type: "uint256",
      },
    ],
    name: "updateMinRequiredFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const aaveFlashABI = [
  {
    inputs: [
      {
        internalType: "contract ILendingPoolAddressesProvider",
        name: "_provider",
        type: "address",
      },
      {
        internalType: "address",
        name: "_arbitrageContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BorrowedLog",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldArbitrageContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newArbitrageContract",
        type: "address",
      },
    ],
    name: "UpdatedArbitrageContract",
    type: "event",
  },
  {
    inputs: [],
    name: "ADDRESSES_PROVIDER",
    outputs: [
      {
        internalType: "contract ILendingPoolAddressesProvider",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LENDING_POOL",
    outputs: [
      {
        internalType: "contract ILendingPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "arbitrageContract",
    outputs: [
      {
        internalType: "contract Arbitrage",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "assets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "premiums",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "params",
        type: "bytes",
      },
    ],
    name: "executeOperation",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "flashloan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newArbitrageContract",
        type: "address",
      },
    ],
    name: "updateArbitrageContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];
const erc20TokenABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
];

login();

async function login() {
  await window.ethereum.enable();
  const network = await provider.getNetwork();
  if (network.chainId !== "0x1") {
    window.alert("Please switch to the Ethereum network");
    return;
  }
  populateArbitrage();
}

async function populateArbitrage() {
  const requiredAmount = await getRequiredAmount();
  const arbitrageAmount = await getArbitrageAmount();
  document.getElementById("requiredAmount").value =
    ethers.utils.formatEther(requiredAmount);
  document.getElementById("arbitrageAmount").value =
    ethers.utils.formatEther(arbitrageAmount);
}

async function takeArbitrage() {
  const arbitrageContract = new ethers.Contract(
    arbitrageAddress,
    arbitrageABI,
    signer
  );
  const receipt = await arbitrageContract.performArbitrage(arbitrageToken);
  console.log(receipt);
}

async function getRequiredAmount() {
  const arbitrageContract = new ethers.Contract(
    arbitrageAddress,
    arbitrageABI,
    provider
  );
  const requiredAmount = await arbitrageContract.minRequiredFunds();
  return requiredAmount;
}

async function getArbitrageAmount() {
  const arbitrageTokenContract = new ethers.Contract(
    arbitrageToken,
    erc20TokenABI,
    provider
  );
  const arbitrageContract = new ethers.Contract(
    arbitrageAddress,
    arbitrageABI,
    provider
  );
  const balance = await arbitrageTokenContract.balanceOf(arbitrageAddress);
  const totalSupply = await arbitrageTokenContract.totalSupply();
  const mockArbitrageBalance = await arbitrageContract.balanceOf(
    arbitrageToken
  );
  const arbitrageAmount = balance.add(mockArbitrageBalance).sub(totalSupply);
  return arbitrageAmount;
}

async function flashloan() {
  const amount = ethers.utils.parseEther(
    document.getElementById("flashloanAmount").value
  );
  const flashloanContract = new ethers.Contract(
    flashloanContractAddress,
    aaveFlashABI,
    signer
  );
  const flashloanReceipt = await flashloanContract.flashloan(
    arbitrageToken,
    amount
  );
  console.log(flashloanReceipt);
  window.alert(
    "operation concluded with hash " + flashloanReceipt["transactionHash"]
  );
  return flashloanReceipt;
}

async function withdraw() {
  const flashloanContract = new ethers.Contract(
    flashloanContractAddress,
    aaveFlashABI,
    signer
  );
  const withdrawReceipt = await flashloanContract.withdraw(arbitrageToken);
  console.log(withdrawReceipt);
  window.alert(
    "operation concluded with hash " + withdrawReceipt["transactionHash"]
  );
  return withdrawReceipt;
}
