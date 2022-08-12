import DappToken from "./chain-info/contracts/DappToken.json"
import EthSwap from "./chain-info/contracts/EthSwap.json"
import networkMapping from "./chain-info/deployments/map.json"
import {Contract, providers, utils} from "ethers";

export const getDeployedContracts = async () => {
    const dappToken = await getDeployedContract(DappToken, "DappToken")
    const ethSwap = await getDeployedContract(EthSwap, "EthSwap")
    return {dappToken, ethSwap}
}

const getDeployedContract = async (contractJson, contractName) => {
    const {abi} = contractJson
    const provider = new providers.Web3Provider(window.ethereum)
    const {chainId} = await provider.getNetwork()
    if (!chainId || !networkMapping[String(chainId)]) {
        return null
    }
    const contractAddress = networkMapping[String(chainId)][contractName][0]
    const contractInterface = new utils.Interface(abi)
    const contract = new Contract(contractAddress, contractInterface, provider.getSigner())
    return await contract.deployed()
}