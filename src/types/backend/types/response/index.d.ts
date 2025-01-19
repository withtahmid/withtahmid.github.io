interface ResponseAbstract {
    success: boolean;
    message: string;
}
export interface SuccessResponse<T> extends ResponseAbstract {
    success: true;
    data: T;
}
export interface PartialSuccessResponse extends ResponseAbstract {
    success: false;
    errorCode: string;
}
export interface ErrorResponse extends ResponseAbstract {
    success: false;
    error: string;
}
export type Response<T> = SuccessResponse<T> | PartialSuccessResponse | ErrorResponse;
export {};
