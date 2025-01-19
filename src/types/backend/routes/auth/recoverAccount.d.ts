import { RecoverAccountResponse, RecoverAccountSentURLResponse } from "../../types/response/auth";
import { Response } from "../../types/response";
declare const recoverAccountRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        ctx_user: import("../../types/trpc").CTX_User | null;
    };
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    changePassword: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                ctx_user: import("../../types/trpc").CTX_User | null;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            ctx_user: import("../../types/trpc").CTX_User | null;
        };
        _input_in: {
            password: string;
            urlParam: string;
            confirmPassword: string;
        };
        _input_out: {
            password: string;
            urlParam: string;
            confirmPassword: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, Response<RecoverAccountResponse>>;
    sendRecoveryURL: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                ctx_user: import("../../types/trpc").CTX_User | null;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            ctx_user: import("../../types/trpc").CTX_User | null;
        };
        _input_in: string;
        _input_out: string;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, Response<RecoverAccountSentURLResponse>>;
}>;
export default recoverAccountRouter;
