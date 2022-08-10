import pytest
from brownie import exceptions

from scripts.deploy import deploy
from scripts.helpful_scripts import get_account, tokens, ether

RATE = 100
INITIAL_SUPPLY = tokens(1_000_000)


def test_contract_has_tokens():
    dapp_token, eth_swap = deploy()
    assert dapp_token.balanceOf(eth_swap) == tokens(1_000_000)


def test_buy_tokens():
    investor = get_account(index=1)
    dapp_token, eth_swap = deploy()

    tx = eth_swap.buyTokens({'from': investor, 'value': ether(1)})

    assert dapp_token.balanceOf(investor) == tokens(RATE)
    assert dapp_token.balanceOf(eth_swap) == INITIAL_SUPPLY - tokens(RATE)
    assert eth_swap.balance() == ether(1)

    assert tx.events['TokensPurchased']['account'] == investor
    assert tx.events['TokensPurchased']['token'] == dapp_token
    assert tx.events['TokensPurchased']['amount'] == tokens(RATE)
    assert tx.events['TokensPurchased']['rate'] == RATE


def test_sell_tokens():
    investor = get_account(index=1)
    dapp_token, eth_swap = deploy()

    eth_swap.buyTokens({'from': investor, 'value': ether(1)})

    dapp_token.approve(eth_swap.address, tokens(100), {'from': investor})

    # Selling more tokens than balance
    with pytest.raises(exceptions.VirtualMachineError):
        eth_swap.sellTokens(tokens(500), {'from': investor})

    tx = eth_swap.sellTokens(tokens(50), {'from': investor})

    assert dapp_token.balanceOf(investor) == tokens(50)
    assert dapp_token.balanceOf(eth_swap) == INITIAL_SUPPLY - tokens(50)
    assert eth_swap.balance() == ether(0.5)

    assert tx.events['TokensSold']['account'] == investor
    assert tx.events['TokensSold']['token'] == dapp_token
    assert tx.events['TokensSold']['amount'] == tokens(50)
    assert tx.events['TokensSold']['rate'] == RATE
