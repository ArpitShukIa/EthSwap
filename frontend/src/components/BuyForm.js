import React, {useState} from 'react';
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'

function BuyForm({dappTokenBalance, ethBalance, buyTokens}) {
    const [ether, setEther] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        if (ether) {
            buyTokens(ether)
            setEther('')
        }
    }

    return (
        <form className="mb-3" onSubmit={onSubmit}>
            <div>
                <label><b>Input</b></label>
                <span className="float-end text-muted">
                    Balance: {ethBalance.toFixed(3)}
                </span>
            </div>
            <div className="input-group mb-4">
                <input
                    type="number"
                    step="any"
                    onChange={e => setEther(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="0"
                    required/>
                <div className="input-group-text">
                    <img src={ethLogo} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; ETH
                </div>
            </div>
            <div>
                <label><b>Output</b></label>
                <span className="float-end text-muted">
                    Balance: {dappTokenBalance}
                </span>
            </div>
            <div className="input-group mb-2">
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="0"
                    value={+ether * 100}
                    disabled
                />
                <div className="input-group-text">
                    <img src={tokenLogo} height='32' alt=""/>
                    &nbsp; DApp
                </div>
            </div>
            <div className="mb-4">
                <span className="text-muted">Exchange Rate</span>
                <span className="float-end text-muted">1 ETH = 100 DApp</span>
            </div>
            <button type="submit" className="btn btn-primary w-100">SWAP!</button>
        </form>
    );
}

export default BuyForm;