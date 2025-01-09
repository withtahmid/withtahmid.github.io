import { SignupResponse } from "../types/response";
declare const signupProcedure: import("@trpc/server").BuildProcedure<"mutation", {
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
        name: string;
        username: string;
        email: string;
        password: string;
    };
    _input_out: {
        name: string;
        username: string;
        email: string;
        password: string;
    };
    _output_in: typeof import("@trpc/server").unsetMarker;
    _output_out: typeof import("@trpc/server").unsetMarker;
}, SignupResponse>;
export default signupProcedure;
