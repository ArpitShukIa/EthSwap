from brownie import network, config, DappToken, EthSwap

from scripts.helpful_scripts import get_account, tokens


def deploy():
    account = get_account()
    dapp_token = DappToken.deploy(
        {'from': account},
        publish_source=config["networks"][network.show_active()].get("verify", False)
    )
    eth_swap = EthSwap.deploy(
        dapp_token.address,
        {'from': account},
        publish_source=config["networks"][network.show_active()].get("verify", False)
    )
    # Transfer all tokens to eth_swap contract
    dapp_token.transfer(eth_swap.address, tokens(1_000_000))
    return dapp_token, eth_swap


def main():
    deploy()
