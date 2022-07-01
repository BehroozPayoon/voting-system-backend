const { expect, assert } = require("chai")
const { network, ethers, upgrades } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("Voting System Unit Tests", function () {
          let votingSystem

          beforeEach(async function () {
              const VotingSystem = await ethers.getContractFactory("VotingSystem")
              votingSystem = await upgrades.deployProxy(VotingSystem, [])
              await votingSystem.deployed()
          })

          describe("Add Ballot Box", function () {
              const options = ["Option1", "Option2"]

              it("Check Total Items", async function () {
                  await votingSystem.addBallotBox("Test", options)
                  const totalItems = await votingSystem.getTotalItems()
                  assert(totalItems.toString() == "1")
                  const ballotBox = await votingSystem.getBallotBox(0)
                  assert(ballotBox.name == "Test")
              })

              it("Emit event", async function () {
                  expect(await votingSystem.addBallotBox("Test", options)).to.emit(
                      "BallotBoxAdded"
                  )
              })
          })

          describe("Start voting", function () {
              beforeEach(async function () {
                  const options = ["Option1", "Option2"]
                  await votingSystem.addBallotBox("Test", options)
              })

              it("Change state to voting", async function () {
                  await votingSystem.startVote(0)
                  const ballotBox = await votingSystem.getBallotBox(0)
                  assert(ballotBox.state == "1")
              })
          })

          describe("Add vote", function () {
              beforeEach(async function () {
                  const options = ["Option1", "Option2"]
                  await votingSystem.addBallotBox("Test", options)
              })

              it("revert exception if not in voting state", async function () {
                  await expect(votingSystem.vote(0, 0)).to.be.revertedWith(
                      "VotingSystem__NotInVoting"
                  )
              })

              it("vote process", async function () {
                  await votingSystem.startVote(0)
                  await votingSystem.vote(0, 0)
                  const ballotBox = await votingSystem.getBallotBox(0)
                  assert(ballotBox.totalVotes.toString() == "1")
                  const vote = await votingSystem.getAddressVote(0)
                  assert(vote == "Option1")
              })
          })

          describe("End voting", function () {
              beforeEach(async function () {
                  const options = ["Option1", "Option2"]
                  await votingSystem.addBallotBox("Test", options)
              })

              it("revert exception if not in voting state", async function () {
                  await expect(votingSystem.endVote(0)).to.be.revertedWith(
                      "VotingSystem__NotInVoting"
                  )
              })

              it("end voting", async function () {
                  await votingSystem.startVote(0)
                  await votingSystem.endVote(0)
                  const ballotBox = await votingSystem.getBallotBox(0)
                  assert(ballotBox.state.toString() == "2")
              })

              it("end voting emit event", async function () {
                  await votingSystem.startVote(0)
                  expect(await votingSystem.endVote(0)).to.emit("VotingEnded")
              })
          })
      })
