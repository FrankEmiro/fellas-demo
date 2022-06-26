import { useContext } from "react";
import { IReducerAction } from "../reducer";
import { Context, IStateType } from "../store";

export default function useCurrentState() {
    return useContext<[IStateType, (action: IReducerAction) => any]>(Context)
}