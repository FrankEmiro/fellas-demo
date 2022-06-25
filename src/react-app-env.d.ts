/// <reference types="react-scripts" />

import { BridgeEventEnum } from "./App";

export {};

interface IBridgeEvent {
    event: BridgeEventEnum;
    data?: any;
}
interface IMessagePortBridgeAPI {
    init: () => void;
    onmessage: (event: { data: IBridgeEvent }) => void;
    postMessage: (data: IBridgeEvent) => void;
}

declare global {
    interface Window {
        MessagePortBridge: IMessagePortBridgeAPI;
    }
}