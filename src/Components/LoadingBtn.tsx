interface LoadingBtnProps{
    label: string;
    loading: boolean;
    onClick: any;
}
const LoadingBtn:React.FC<LoadingBtnProps> = ({ label, loading, onClick}):React.ReactNode => {
    return (
        <button onClick={onClick} className="btn btn-primary">
            {loading ? <span className="loading loading-spinner loading-md"></span> : <>{label}</>}
        </button>
    )
}
export default LoadingBtn;