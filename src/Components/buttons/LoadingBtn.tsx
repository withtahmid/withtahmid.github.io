interface LoadingBtnProps{
    label: string;
    loading: boolean;
    onClick: any;
    disabled?: boolean; 
    className?:string;
}
const LoadingBtn:React.FC<LoadingBtnProps> = ({ label, loading, onClick, disabled, className}):React.ReactNode => {
    return (
        <button disabled={disabled} onClick={onClick} className={`btn btn-primary ${className}`}>
            {loading ? <span className="loading loading-spinner loading-md"></span> : <>{label}</>}
        </button>
    )
}
export default LoadingBtn;