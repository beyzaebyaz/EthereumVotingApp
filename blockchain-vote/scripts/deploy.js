const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");

  const voterAddresses = [
    "0x467f71F7dd842144289DF555FBF756dD115519B8",
    "0xe3d1F8596C56e4deD7556782F1f99B339F1BFcae",
    "0x6262bcE0e1fbc1d7dEE979F9BD1A5D1611946F20",
    "0x3E47a2929D4038BeDa1D26cB3b9216C021dE7887",
    "0x4A7953173dd1d919cDbc5fEaB1616232229dCF87"
  ];

  const overrides = {
    gasPrice: hre.ethers.parseUnits("1", "gwei"), 
  };

  console.log("Deploying contract with voters:", voterAddresses);
  const voting = await Voting.deploy(voterAddresses, overrides);
  await voting.waitForDeployment();
  const deployedAddress = await voting.getAddress();
  console.log(`Contract deployed to: ${deployedAddress}`);

  // Seçmen listesini kontrol et
  console.log("\nVerifying voters...");
  for(let i = 0; i < voterAddresses.length; i++) {
    const voter = await voting.voters(i);
    console.log(`Voter ${i + 1}: ${voter.addr} (Registered: ${voter.addr.toLowerCase() === voterAddresses[i].toLowerCase()})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
