import { AccountRecoveryCodeSendResponse, SubmitAccountVerificationCodeResponse } from "../types/response";
declare const recoverAccountRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        user: import("../types/auth").JWT_User | null;
    };
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    sendCode: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                user: import("../types/auth").JWT_User | null;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            user: import("../types/auth").JWT_User | null;
        };
        _input_in: {
            emailOrUsername: string;
        };
        _input_out: {
            emailOrUsername: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, AccountRecoveryCodeSendResponse>;
    submitCode: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                user: import("../types/auth").JWT_User | null;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            user: import("../types/auth").JWT_User | null;
        };
        _input_in: {
            password: string;
            verificationCode: string;
            emailOrUsername: string;
        };
        _input_out: {
            password: string;
            verificationCode: string;
            emailOrUsername: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, SubmitAccountVerificationCodeResponse>;
}>;
export default recoverAccountRouter;
