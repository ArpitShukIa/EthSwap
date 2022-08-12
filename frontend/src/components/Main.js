import React, {useState} from 'react';
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

function Main({dappTokenBalance, ethBalance, buyTokens, sellTokens}) {
    const [currentForm, setCurrentForm] = useState('buy')

    return (
        <div id="content" className="mt-3">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-light" onClick={() => setCurrentForm('buy')}>
                    Buy
                </button>
                <span className="text-muted">&lt; &nbsp; &gt;</span>
                <button className="btn btn-light" onClick={() => setCurrentForm('sell')}>
                    Sell
                </button>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    {
                        currentForm === 'buy'
                            ? <BuyForm
                                dappTokenBalance={dappTokenBalance}
                                ethBalance={ethBalance}
                                buyTokens={buyTokens}
                            />
                            : <SellForm
                                dappTokenBalance={dappTokenBalance}
                                ethBalance={ethBalance}
                                sellTokens={sellTokens}
                            />
                    }
                </div>
            </div>
        </div>
    );
}

export default Main;