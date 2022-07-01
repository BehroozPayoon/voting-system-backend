// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./VotingSystem.sol";

error VotingSystemV2__NotEnded();

contract VotingSystemV2 is VotingSystem {
    event VotingRestarted(uint256 indexed _ballotBoxId);

    modifier isInEndedState(uint256 _ballotBoxId) {
        if (ballotBoxRegistery[_ballotBoxId].state != State.Ended) {
            revert VotingSystemV2__NotEnded();
        }
        _;
    }

    function restartVoting(uint256 _ballotBoxId) external isInEndedState(_ballotBoxId) {
        ballotBoxRegistery[_ballotBoxId].state = State.Voting;
        emit VotingRestarted(_ballotBoxId);
    }
}
