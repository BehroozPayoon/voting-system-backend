const { ethers, upgrades } = require("hardhat")

async function main() {
    const VotingSystem = await ethers.getContractFactory("VotingSystem")
    const votingSystem = await upgrades.deployProxy(VotingSystem)
    await votingSystem.deployed()

    console.log(votingSystem.address, " votingSystem(proxy) address")
    console.log(
        await upgrades.erc1967.getImplementationAddress(votingSystem.address),
        " getImplementationAddress"
    )
    console.log(await upgrades.erc1967.getAdminAddress(votingSystem.address), " getAdminAddress")
}

main()
