import { baseFrontendURI } from "../../configs/urls";
const NotFound = () => {

    const goToHome = () => {
        window.location.assign(baseFrontendURI);
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div>
                <h1>404 - Page Not Found</h1>
                <p>Oops! The page you're looking for doesn't exist.</p>
                <button className="hover:underline" onClick={goToHome}>Go to Home</button>
            </div>
        </div>
    );
};

export default NotFound;
