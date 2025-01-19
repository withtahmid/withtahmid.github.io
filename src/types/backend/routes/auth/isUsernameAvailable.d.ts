import { Response } from "../../types/response";
import { IsUsernameAvailableRespone } from "../../types/response/auth";
declare const isUsernameAvailableProcedure: import("@trpc/server").BuildProcedure<"query", {
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
}, Response<IsUsernameAvailableRespone>>;
export default isUsernameAvailableProcedure;
