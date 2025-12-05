import ToastProvider from "./Components/ToastProvider";
import Portfolio from "./Pages/Prortfolio";
import Router from "./Router";

const App = () => {
    // return <Portfolio />;  return (
    return (
        <ToastProvider>
            <Router />
        </ToastProvider>
    );
};
export default App;
