import { useEffect } from "react";
import "./App.css";
import { BridgeEventEnum } from "./model/reducer";
import useCurrentState from "./model/state-hooks/useCurrentState";

function App() {
  // Simple state
  const [state, dispatch] = useCurrentState();

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

    return () => {
      window.MessagePortBridge.postMessage({
        event: BridgeEventEnum.STOP_TICK,
      })
    };
  }, [dispatch]);

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
