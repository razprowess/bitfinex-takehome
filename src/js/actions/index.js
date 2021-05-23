import {
    INVALIDATE_ASKS,
    INVALIDATE_BIDS,
    ADD_ASKS,
    ADD_BIDS,
    DELETE_ASKS,
    DELETE_BIDS
} from "../constants/action-types";

export function addAsks(payload) {
    return { type: ADD_ASKS, payload };
}

export function addBids(payload) {
    return { type: ADD_BIDS, payload };
}

export function invalidateAsks(payload) {
    return { type: INVALIDATE_ASKS, payload };
}

export function invalidateBids(payload) {
    return { type: INVALIDATE_BIDS, payload };
}

export function deleteAsks(payload) {
    return { type: DELETE_ASKS, payload };
  }

  export function deleteBids(payload) {
    return { type: DELETE_BIDS, payload };
  }