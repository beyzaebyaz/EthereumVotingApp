// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

contract Voting {
    struct Voter {
        address addr;
        bool hasVoted;
    }

    Voter[] public voters;
    address public owner;
    bool public isVotingActive;

    uint72 public optionOne;
    uint72 public optionTwo;

    constructor(address[5] memory _voters) {
        owner = msg.sender;
        isVotingActive = true;
        for (uint i = 0; i < _voters.length; i++) {
            voters.push(Voter(_voters[i], false));
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Sadece owner bu islemi yapabilir.");
        _;
    }

    function vote(bool voteForFirst) public {
        require(isVotingActive, "Oy verme islemi sona erdi.");
        (bool isEligible, uint index) = isEligibleVoter(msg.sender);
        require(isEligible, "Oy kullanma yetkiniz yok.");
        require(!voters[index].hasVoted, "Bu adres zaten oy kullandi.");

        voters[index].hasVoted = true;

        if (voteForFirst) {
            optionOne += 1;
        } else {
            optionTwo += 1;
        }
    }

    function endVoting() public onlyOwner {
        require(isVotingActive, "Oylama zaten sonlandirildi.");
        isVotingActive = false;
    }

    function getVotes() public view returns (uint72, uint72) {
        return (optionOne, optionTwo);
    }

    function isEligibleVoter(address _addr) internal view returns (bool, uint) {
        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].addr == _addr) {
                return (true, i);
            }
        }
        return (false, 0);
    }
} 