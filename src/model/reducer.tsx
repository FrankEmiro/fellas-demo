import { IStateType } from "./store";

export enum BridgeEventEnum {
    TICK = "TICK",
    STOP_TICK = "STOP_TICK",
    ADDITION = "ADDITION",
}

export interface IReducerAction {
    type: string;
    data: any;
}

export default function reducer(state: IStateType, action: IReducerAction) {
    switch (action.type) {
        case BridgeEventEnum.TICK:
            const tickCount = ++state.tickCount;
            console.warn("Tick Count:", tickCount)

            return {
                ...state,
                tickCount,
            };
        case BridgeEventEnum.ADDITION:
            return {
                ...state,
                totalNum: action.data,
            };
        default:
            return state;
    }
}