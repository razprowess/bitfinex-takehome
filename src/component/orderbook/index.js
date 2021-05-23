import React, {useEffect, useState} from "react"
import { useSelector, useDispatch } from 'react-redux';
import { addAsks, addBids, deleteAsks, deleteBids, invalidateAsks, invalidateBids } from "../../js/actions";
import './index.css';

let wsUri = "wss://api-pub.bitfinex.com/ws/2";

var HAS_RECEIVED_INITIAL_SNAPSHOT = false;

var BOOK_CHANNEL_ID;

const OrderBookTable = () => {
    const asks = useSelector(state => state.asks)
    const bids = useSelector(state => state.bids)

    const askTableData = () => {
        return asks.map(ele => {
            return <tr key={`${ele[0]}${ele[0]}`}>
                <td>{ele[1]}</td>
                <td>{parseFloat(ele[2]).toPrecision(5)}</td>
                <td>{ele[0]}</td>
            </tr>
        })
    }

    const bidTableData = () => {
        return bids.map(ele => {
            return <tr key={`${ele[0]}${ele[0]}`}>
                <td>{ele[0]}</td>
                <td>{ele[2].toPrecision(5)}</td>
                <td>{ele[1]}</td>
            </tr>
        })
    }
    return (
        <div className="row">
            <div className="col-md-6">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Count</th>
                            <th>Amount</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {askTableData()}
                    </tbody>
                </table>
            </div>
            <div className="col-md-6">
            <table className="table">
                    <thead>
                        <tr>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bidTableData()}
                    </tbody>
                </table>
            </div>
        </div>

    )
}

var webSocket;
function OrderBook() {

    const [isConnected, setIsConnected] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if(!webSocket){
            webSocket = new WebSocket(wsUri);
        }

        initWebsocketListeners();

        return () => {

            webSocket.close();

        };

    }, []);

    const initWebsocketListeners = ()=>{
        webSocket.onerror = (error) => {
        }

        webSocket.onmessage = onWebsocketMessageReceived;
        
        webSocket.onopen = (openEvent) => {
            setIsConnected(true);
            webSocket.send(JSON.stringify({
                event:'subscribe', channel:'book', symbol:'tBTCUSD'
            }))

        }

        webSocket.onclose = (closeEvent) => {
            setIsConnected(false);
        }
    }

    const removePriceLevelFromBids = (priceItem) => {
        const payload = { price: priceItem[0], amount: priceItem[2] }
        dispatch(deleteBids(payload));
    }

    const removePriceLevelFromAsks = (priceItem) => {
        const payload  = { price: priceItem[0], amount: priceItem[2] }
        dispatch(deleteAsks(payload));
    }

    const addPriceLevelToBids = (priceItem) => {
        dispatch(addBids(priceItem));
    }

    const addPriceLevelToAsks = (priceItem) => {

        dispatch(addAsks(priceItem));

    }

    const processSnaphoptMessage = (data) => {
        let initialSnapshot = data[1];

        let BIDS = [];

        let ASKS = [];

        for (let item of initialSnapshot) {

            let amount = item[2];

            if (amount > 0) {
                BIDS.push(item);
            }
            else {
                ASKS.push(item);
            }

        }

        HAS_RECEIVED_INITIAL_SNAPSHOT = true;

        //invalidate the bids / asks data in redux
        dispatch(invalidateBids(BIDS));
        dispatch(invalidateAsks(ASKS));
    }


    const processDeletionOfPriceLevelMessage = (item)=>{
    
        let amount = item[2];

        if (amount == 1) {
            removePriceLevelFromBids(item);
        }

        else {
            removePriceLevelFromAsks(item);
        }

    }

    const processAdditionOfPriceLevelMessage = (item)=>{

        let amount = item[2];
        
        if (amount > 0) {
            addPriceLevelToBids(item);
        }
        
        else {
            addPriceLevelToAsks(item);
        }

    }

    const onWebsocketMessageReceived = (messageEvent) => {

    
        let { data } = messageEvent;

        data = JSON.parse(data);

        //determine if message if for the book.

        if (BOOK_CHANNEL_ID && Array.isArray(data) && data[0] == BOOK_CHANNEL_ID) {

            if (!HAS_RECEIVED_INITIAL_SNAPSHOT) {

                processSnaphoptMessage(data);

            }

            else {

                //process new real time data.
                let item = data[1];

                let count = item[1];

                if (count == 0) {
                    processDeletionOfPriceLevelMessage(item);
                }

                else {
                    processAdditionOfPriceLevelMessage(item);
                }


            }

        }


        //determine if message is order book channel subscription success message.

        if (data.event == "subscribed" && data.channel == "book") {

            BOOK_CHANNEL_ID = data.chanId;

        }

    }

    const toggleConnection = ()=>{

        if(isConnected && webSocket){

                webSocket.close();

        }

        else if(!isConnected){
            webSocket = new WebSocket(wsUri);
            initWebsocketListeners();
        }
    }

    return (
        <div className="container">
            <div style={{padding:'16px'}}>
            <button className="btn btn-primary" onClick={toggleConnection}>{!isConnected ? 'CONNECT': 'DISCONNECT'}</button>
            </div>
            <OrderBookTable/>
        </div>
    );
}

export default OrderBook;
