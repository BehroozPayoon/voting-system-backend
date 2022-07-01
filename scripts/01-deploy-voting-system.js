const { ethers, upgrades } = require("hardhat")

async function main() {
    const VotingSystem = await ethers.getContractFactory("VotingSystem")
    const votingSystem = await upgrades.deployProxy(VotingSystem)
    await votingSystem.deployed()
    console.log("Voting System deployed to:", votingSystem.address)
}

main()
