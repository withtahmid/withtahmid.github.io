const ErrorMessage = ({ text }: { text: string }) => {
    return (
        <>
        { text.length > 0 ? <label className="text-red-500 font-roboto my-1"> { text } </label> : "" }
        </>
    );
};
export default ErrorMessage;