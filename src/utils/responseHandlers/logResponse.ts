import { Response } from "../../types/backend/types/response";

export const logResponse = (response: Response<any>) => {
    if("errorCode" in response){
        console.warn(`[${response.errorCode}]: ${response.message}`);
    }else if("error" in response){
        console.error(`[${response.error}]: ${response.message}`);
    }
}