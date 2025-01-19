import { Response } from "../../types/response";
import { FetchUserResponse } from "../../types/response/user";
declare const fetchUserProcedure: import("@trpc/server").BuildProcedure<"query", {
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
        ctx_user: import("../../types/trpc").CTX_User;
    };
    _input_in: typeof import("@trpc/server").unsetMarker;
    _input_out: typeof import("@trpc/server").unsetMarker;
    _output_in: typeof import("@trpc/server").unsetMarker;
    _output_out: typeof import("@trpc/server").unsetMarker;
}, Response<FetchUserResponse>>;
export default fetchUserProcedure;
