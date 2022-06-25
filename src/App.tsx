import React, { useEffect, useReducer } from "react";
import logo from "./logo.svg";
import "./App.css";

export enum BridgeEventEnum {
  TICK = "TICK",
  STOP_TICK = "STOP_TICK",
  ADDITION = "ADDITION",
}

function App() {
  // Simple state
  const [state, dispatch] = useReducer(reducer, { tickCount: 0, totalNum: 10 })

  useEffect(() => {
    console.log("Use effect!")
    window.MessagePortBridge.postMessage({
      event: BridgeEventEnum.TICK,
    });
    window.MessagePortBridge.onmessage = (event) => {
      const { data } = event;
      const eventName = data.event;
      const eventData = data.data;

      switch (data.event) {
        case BridgeEventEnum.TICK:
          dispatch({ type: eventName, data: null })
          break;
        case BridgeEventEnum.ADDITION:
          dispatch({ type: eventName, data: eventData })
          break;
      }
    }

    return () => window.MessagePortBridge.postMessage({
      event: BridgeEventEnum.STOP_TICK,
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>This is a ticker</p>
        <div>{state.tickCount}</div>

        <p>Add 1 by pressing button below</p>
        <div>{state.totalNum}</div>
        <button type="button" onClick={() => {
          window.MessagePortBridge.postMessage({ event: BridgeEventEnum.ADDITION, data: state.totalNum });
        }}>Add 1</button>
      </header>
    </div>
  );
}

export default App;

function reducer(state: any, action: { type: string, data: any }) {
  switch (action.type) {
    case BridgeEventEnum.TICK:
      const tickCount = ++state.tickCount;
      console.log("Tick Count:", tickCount)

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