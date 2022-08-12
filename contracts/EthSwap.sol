pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EthSwap {

    IERC20 public dappToken;
    uint public rate = 100;

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(address _dappTokenAddress) public {
        dappToken = IERC20(_dappTokenAddress);
    }

    function buyTokens() public payable {
        // Calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;

        // Require that EthSwap has enough tokens
        require(dappToken.balanceOf(address(this)) >= tokenAmount);

        // Transfer tokens to the user
        dappToken.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokensPurchased(msg.sender, address(dappToken), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        // User can't sell more tokens than they have
        require(dappToken.balanceOf(msg.sender) >= _amount, "EthSwap: token amount exceeds balance");

        // Calculate the amount of Ether to redeem
        uint etherAmount = _amount / rate;

        // Require that EthSwap has enough Ether
        require(address(this).balance >= etherAmount, "EthSwap: insufficient ether");

        // Perform sale
        dappToken.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(etherAmount);

        // Emit an event
        emit TokensSold(msg.sender, address(dappToken), _amount, rate);
    }

}
