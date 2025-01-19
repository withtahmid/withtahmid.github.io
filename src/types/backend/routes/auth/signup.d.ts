import { Response } from "../../types/response/";
import { SignupResponse } from "../../types/response/auth";
declare const signupProcedure: import("@trpc/server").BuildProcedure<"mutation", {
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
        name: string;
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
    _input_out: {
        name: string;
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
    _output_in: typeof import("@trpc/server").unsetMarker;
    _output_out: typeof import("@trpc/server").unsetMarker;
}, Response<SignupResponse>>;
export default signupProcedure;
