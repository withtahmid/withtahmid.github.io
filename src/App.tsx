import ToastProvider from "./Components/ToastProvider";
import Router from "./Router";

const App = () => {
  return (
    <ToastProvider>
      <Router /> 
    </ToastProvider>
  )
  
}
export default App;