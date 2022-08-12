import {useEffect, useState} from "react";
import {useEtherBalance, useEthers, useTokenBalance} from "@usedapp/core";
import {BigNumber, FixedNumber, providers, utils} from "ethers";
import {getDeployedContracts} from "../contractUtils";
import {CircularProgress} from "@mui/material";
import Main from "./Main";
import networkMapping from "../chain-info/deployments/map.json"

function App() {
    const [ethSwap, setEthSwap] = useState(null)
    const [dappToken, setDappToken] = useState(null)

    const [loading, setLoading] = useState(false)

    const {account, activateBrowserWallet, deactivate, chainId} = useEthers()
    const tokenAddress = networkMapping[String(chainId)]["DappToken"][0]

    const etherBalance = +utils.formatEther(useEtherBalance(account) ?? 0)
    const tokenBalance = +utils.formatEther(useTokenBalance(tokenAddress, account) ?? 0)

    const isConnected = account !== undefined

    useEffect(() => {
        const provider = new providers.Web3Provider(window.ethereum, "any")
        provider.on("network", (newNetwork, oldNetwork) => {
            // When a Provider makes its initial connection, it emits a "network"
            // event with a null oldNetwork along with the newNetwork. So, if the
            // oldNetwork exists, it represents a changing network
            if (oldNetwork) {
                window.location.reload()
            }
        })
    }, [])

    useEffect(() => {
        if (!account || ethSwap)
            return
        const run = async () => {
            setLoading(true)
            const {dappToken, ethSwap} = await getDeployedContracts()
            const provider = new providers.Web3Provider(window.ethereum, "any")
            console.log((await provider.getBalance(ethSwap.address)).toString())
            if (ethSwap) {
                setDappToken(dappToken)
                setEthSwap(ethSwap)
                setLoading(false)
            } else {
                window.alert('Please connect to Rinkeby Test Network')
            }
        }
        run()
    }, [account, chainId])

    const buyTokens = async (etherAmount) => {
        setLoading(true)
        try {
            const tx = await ethSwap.buyTokens({value: FixedNumber.from(etherAmount)})
            await tx.wait(1)
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    const sellTokens = async (tokenAmount) => {
        setLoading(true)
        try {
            const value = FixedNumber.from(tokenAmount)
            const tx1 = await dappToken.approve(ethSwap.address, value)
            await tx1.wait(1)
            const tx2 = await ethSwap.sellTokens(value, {gasLimit: 50000})
            await tx2.wait(1)
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    return (
        <div>
            <div style={{width: "40%", marginLeft: "30%"}}>
                {
                    loading
                        ?
                        <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <CircularProgress size={80}/>
                        </div>
                        : <div>
                            {
                                isConnected ?
                                    <button className="btn btn-secondary"
                                            style={{position: "absolute", right: 30}}
                                            onClick={deactivate}
                                    >
                                        Disconnect
                                    </button>
                                    : ""
                            }
                            <h2 className="mt-3" style={{textAlign: "center"}}>Eth Swap</h2>
                            <hr/>
                            <br/>
                            {
                                isConnected
                                    ? <div>
                                        <Main
                                            dappTokenBalance={tokenBalance}
                                            ethBalance={etherBalance}
                                            buyTokens={buyTokens}
                                            sellTokens={sellTokens}
                                        />
                                    </div>
                                    : <div style={{textAlign: "center"}}>
                                        <p style={{fontSize: 20}}>Connect to your Metamask wallet</p>
                                        <button className="btn btn-primary" onClick={activateBrowserWallet}>Connect</button>
                                    </div>
                            }
                        </div>
                }
            </div>
        </div>
    );
}

export default App;
