import os
import shutil

from brownie import network, config, DappToken, EthSwap

from scripts.helpful_scripts import get_account, tokens


def deploy(update_frontend=False):
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

    if update_frontend:
        update_front_end()

    return dapp_token, eth_swap


def update_front_end():
    # Send the build folder
    src = "./build"
    dest = "./frontend/src/chain-info"
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
    print("Front end updated!")


def main():
    deploy(update_frontend=True)
