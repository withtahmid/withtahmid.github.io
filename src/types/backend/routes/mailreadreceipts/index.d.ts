import { Response } from "../../types/response";
import { MailReadReceiptsCreateEmailResponse, MailReadReceiptsDeleteEmailResponse, MailReadReceiptsFetchAllResponse, MailReadReceiptsSeeEmailResponse } from "../../types/response/mailreadreceipts";
declare const mailreadreceiptsRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        ctx_user: import("../../types/trpc").CTX_User | null;
    };
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    fetchAll: import("@trpc/server").BuildProcedure<"query", {
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
    }, Response<MailReadReceiptsFetchAllResponse>>;
    createOne: import("@trpc/server").BuildProcedure<"mutation", {
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
        _input_in: {
            label: string;
        };
        _input_out: {
            label: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, Response<MailReadReceiptsCreateEmailResponse>>;
    deleteOne: import("@trpc/server").BuildProcedure<"mutation", {
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
        _input_in: string;
        _input_out: string;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, Response<MailReadReceiptsDeleteEmailResponse>>;
    seeOne: import("@trpc/server").BuildProcedure<"mutation", {
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
        _input_in: string;
        _input_out: string;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, Response<MailReadReceiptsSeeEmailResponse>>;
}>;
export default mailreadreceiptsRouter;
