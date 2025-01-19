import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
// import {  AppRouter } from "../../cas-backend/src/routes/z";
import { AppRouter } from "./types/backend/routes/index";
import { authTokenKey } from "./config";
import { baseBackendURI } from "./configs/urls";
const getToken = ()=>{
    const token = localStorage.getItem(authTokenKey) ?? null;
    return token;
}

export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: `${baseBackendURI}/trpc`,
            headers: () => {
                const token = getToken();
                return token ? { Authorization: `Bearer ${token}` } : {};
            }
        })
    ],
    transformer: undefined
});
