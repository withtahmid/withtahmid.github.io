import { ReactNode } from "react"

const Toast = ({ message, type } : { message: string, type: string }) => {
    let jsx: ReactNode;
    
    switch(type){
        case "success":
            jsx = (
            <div className="toast toast-end">
                <div className="alert alert-success">
                    <span>{message}</span>
                </div>
            </div>
            )
            break;
        case "error":
            jsx = (
                <div className="toast toast-end">
                    <div className="alert alert-error">
                        <span>{message}</span>
                    </div>
                </div>
                )
                break;
        case "warning":
            jsx = (
                <div className="toast toast-end">
                    <div className="alert alert-warning">
                        <span>{message}</span>
                    </div>
                </div>
                )
                break;
        case "info":
            jsx = (
                <div className="toast toast-end">
                    <div className="alert alert-info">
                        <span>{message}</span>
                    </div>
                </div>
                )
                break;
        default:
            jsx = (
                <div className="toast toast-end">
                    <div className="alert alert-success">
                        <span>{message}</span>
                    </div>
                </div>
                )
    }
    
    return <div className="z-50">
        { jsx }
    </div>
}
export default Toast;