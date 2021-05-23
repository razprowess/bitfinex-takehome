import {
    ADD_ASKS,
    ADD_BIDS,
    INVALIDATE_ASKS,
    INVALIDATE_BIDS,
    DELETE_ASKS,
    DELETE_BIDS
} from "../constants/action-types";

const initialState = {
   bids: [],
   asks: []
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_ASKS:
            let ask = state.asks
            const askPayload = action.payload
          
            for (var i = 0; i < ask.length; i++) {
                if (ask[i][0] == askPayload[0] && ask[i][2] == askPayload[2]) {
                    let ele = ask[i]
                    ele[1] = askPayload[1] 
                    ask[i] = ele
                    return Object.assign({}, state, {
                        asks: ask
                    });
                }
            }
            return Object.assign({}, state, {
                asks: state.asks.concat([action.payload])
            });
        case ADD_BIDS:
            let bid = [...state.bids]
            const bidPayload = action.payload
            for (var i = 0; i < bid.length; i++) {
                if (bid[i][0] == bidPayload[0] && bid[i][2] == bidPayload[2]) {
                    let ele = bid[i]
                    ele[1] = bidPayload[1]
                    bid[i] = ele
                    return Object.assign({}, state, {
                        bids: bid
                    });
                }
            }
            return Object.assign({}, state, {
               bids: state.bids.concat([action.payload])
            });
        case INVALIDATE_ASKS:
            return Object.assign({}, state, {
                asks: action.payload
            });
        case INVALIDATE_BIDS:
            return Object.assign({}, state, {
               bids: action.payload
            });
        case DELETE_ASKS:
            let currentAsk = state.asks
            const deleteAskPayload = action.payload
            for (var i = 0; i < currentAsk.length; i++) {
                if (currentAsk[i][0] == deleteAskPayload.price && currentAsk[i][2] == deleteAskPayload.amount) {
                    currentAsk.splice(i, 1);
                    break;
                }
               
            }
            return Object.assign({}, state, {
                asks: currentAsk
            });

        case DELETE_BIDS:
            let currentBid = state.bids
            const deleteBidPayload = action.payload
            for (var i = 0; i < currentBid.length; i++) {
                if (currentBid[i][0] == deleteBidPayload.price && currentBid[i][2] == deleteBidPayload.amount) {
                    currentBid.splice(i, 1);
                    break;
                }
            }
            return Object.assign({}, state, {
               bids: currentBid
            });
        default :
         break    
    }

    return state;
}

export default rootReducer;