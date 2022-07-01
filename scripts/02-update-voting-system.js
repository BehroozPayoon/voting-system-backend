const { ethers, upgrades } = require("hardhat")

const proxyAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

async function main() {
    const VotingSystemV2 = await ethers.getContractFactory("VotingSystemV2")
    const votingSystemV2 = await upgrades.upgradeProxy(proxyAddress, VotingSystemV2)

    console.log(
        await upgrades.erc1967.getImplementationAddress(votingSystemV2.address),
        " getImplementationAddress"
    )
    console.log(await upgrades.erc1967.getAdminAddress(votingSystemV2.address), " getAdminAddress")
}

main()
