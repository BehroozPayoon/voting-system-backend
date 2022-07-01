// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

error VotingSystem__NotOwner();
error VotingSystem__NotInCreated();
error VotingSystem__NotInVoting();
error VotingSystem__AlreadyVoted();

contract VotingSystem {
    uint256 private totalItems;
    mapping(uint256 => BallotBox) private ballotBoxRegistery;
    mapping(address => mapping(uint256 => string)) private addressVotingRegistery;

    enum State {
        Created,
        Voting,
        Ended
    }

    struct BallotBox {
        string name;
        string[] options;
        address owner;
        State state;
        uint256 totalVotes;
    }

    event BallotBoxAdded(address indexed owner, string name, string[] options);
    event VotingStarted(uint256 indexed ballotBoxId);
    event VotingEnded(uint256 indexed ballotBoxId);
    event Voted(address indexed voter, uint256 indexed ballotBoxId, string indexed option);

    // Modifiers
    modifier ballotOwner(uint256 ballotBoxId) {
        if (msg.sender != ballotBoxRegistery[ballotBoxId].owner) {
            revert VotingSystem__NotOwner();
        }
        _;
    }

    modifier isInCreatedState(uint256 ballotBoxId) {
        if (ballotBoxRegistery[ballotBoxId].state != State.Created) {
            revert VotingSystem__NotInCreated();
        }
        _;
    }

    modifier isInVotingState(uint256 ballotBoxId) {
        if (ballotBoxRegistery[ballotBoxId].state != State.Voting) {
            revert VotingSystem__NotInVoting();
        }
        _;
    }

    modifier notVoted(uint256 _ballotBoxId) {
        bytes memory selectedOption = bytes(addressVotingRegistery[msg.sender][_ballotBoxId]);
        if (selectedOption.length != 0) {
            revert VotingSystem__AlreadyVoted();
        }
        _;
    }

    // Functions
    function initialize() external {
        totalItems = 0;
    }

    function addBallotBox(string calldata _name, string[] calldata _options) external {
        BallotBox memory ballotBox;
        ballotBox.name = _name;
        ballotBox.options = _options;
        ballotBox.owner = msg.sender;
        ballotBox.state = State.Created;
        ballotBox.totalVotes = 0;
        ballotBoxRegistery[totalItems] = ballotBox;
        totalItems++;
        emit BallotBoxAdded(msg.sender, _name, _options);
    }

    function startVote(uint256 _ballotBoxId)
        external
        ballotOwner(_ballotBoxId)
        isInCreatedState(_ballotBoxId)
    {
        ballotBoxRegistery[_ballotBoxId].state = State.Voting;
        emit VotingStarted(_ballotBoxId);
    }

    function vote(uint256 _ballotBoxId, uint256 _optionIndex)
        external
        notVoted(_ballotBoxId)
        isInVotingState(_ballotBoxId)
    {
        BallotBox storage ballotBox = ballotBoxRegistery[_ballotBoxId];
        ballotBox.totalVotes += 1;

        string memory option = ballotBox.options[_optionIndex];
        addressVotingRegistery[msg.sender][_ballotBoxId] = option;

        emit Voted(msg.sender, _ballotBoxId, option);
    }

    function endVote(uint256 _ballotBoxId)
        external
        ballotOwner(_ballotBoxId)
        isInVotingState(_ballotBoxId)
    {
        ballotBoxRegistery[_ballotBoxId].state = State.Ended;
        emit VotingEnded(_ballotBoxId);
    }

    function getTotalItems() external view returns (uint256) {
        return totalItems;
    }

    function getBallotBox(uint256 _ballotBoxId) external view returns (BallotBox memory) {
        return ballotBoxRegistery[_ballotBoxId];
    }

    function getAddressVote(uint256 _ballotBoxId) external view returns (string memory) {
        return addressVotingRegistery[msg.sender][_ballotBoxId];
    }
}
