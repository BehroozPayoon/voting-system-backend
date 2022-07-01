const { expect, assert } = require("chai")
const { network, ethers, upgrades } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("Voting System V2 Unit Tests", function () {
          let votingSystem, votingSystemV2

          beforeEach(async function () {
              const VotingSystem = await ethers.getContractFactory("VotingSystem")
              const VotingSystemV2 = await ethers.getContractFactory("VotingSystemV2")

              votingSystem = await upgrades.deployProxy(VotingSystem, [])
              votingSystemV2 = await upgrades.upgradeProxy(votingSystem.address, VotingSystemV2)

              const options = ["Option1", "Option2"]
              await votingSystemV2.addBallotBox("Test", options)
              votingSystemV2.startVote(0)
          })

          describe("Restart voting", function () {
              it("Revert error if not in ended state", async function () {
                  await expect(votingSystemV2.restartVoting(0)).to.be.revertedWith(
                      "VotingSystemV2__NotEnded"
                  )
              })

              it("Emit event on restart voting", async function () {
                  await votingSystemV2.endVote(0)
                  expect(await votingSystemV2.restartVoting(0)).to.emit("VotingRestarted")
              })
          })
      })
