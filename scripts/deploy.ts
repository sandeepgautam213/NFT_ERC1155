// scripts/deploy.ts
import hre from 'hardhat';

async function main() {
  const nftmint = await hre.ethers.deployContract("NFT",["ipfs://bafkreid5vbbsi4yy3girvkozlkprqkzz3qobpwbiyaw4ethxy7voyvmg6y",1000]);
  await nftmint.waitForDeployment();
  console.log("NFT contract deployed at address: ", await nftmint.getAddress());

  //const [deployer] = await ethers.getSigners();

  //console.log('Deploying contracts with the account:', deployer.address);

 // const NFT = await ethers.getContractFactory('NFT');
// const nft = await NFT.deploy('ipfs://bafkreid5vbbsi4yy3girvkozlkprqkzz3qobpwbiyaw4ethxy7voyvmg6y', 1000); // Replace URI and maxSupply accordingly

 // console.log('NFT contract deployed to:', nft.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
