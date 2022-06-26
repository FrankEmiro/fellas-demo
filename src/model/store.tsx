import { createContext, useReducer } from "react";
import reducer from "./reducer";

export interface IStateType {
    tickCount: number;
    totalNum: number;
}

const initialState: IStateType = {
    tickCount: 0,
    totalNum: 10,
};

const Store = ({ children }: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState as any);

export default Store;
