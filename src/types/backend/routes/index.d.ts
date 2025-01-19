export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        ctx_user: import("../types/trpc").CTX_User | null;
    };
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    auth: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: {
            ctx_user: import("../types/trpc").CTX_User | null;
        };
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        signup: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                ctx_user: import("../types/trpc").CTX_User | null;
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
        }, import("../types/response").Response<import("../types/response/auth").SignupResponse>>;
        login: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                ctx_user: import("../types/trpc").CTX_User | null;
            };
            _input_in: {
                password: string;
                emailOrUsername: string;
            };
            _input_out: {
                password: string;
                emailOrUsername: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../types/response").Response<import("../types/response/auth").LoginResponse>>;
        isUsernameAvailable: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                ctx_user: import("../types/trpc").CTX_User | null;
            };
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../types/response").Response<import("../types/response/auth").IsUsernameAvailableRespone>>;
        verifyAccount: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                ctx_user: import("../types/trpc").CTX_User | null;
            };
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../types/response").Response<import("../types/response/auth").VerifyAccountResponse>>;
        recoverAccount: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: {
                ctx_user: import("../types/trpc").CTX_User | null;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>, {
            changePassword: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: {
                        ctx_user: import("../types/trpc").CTX_User | null;
                    };
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: {
                    ctx_user: import("../types/trpc").CTX_User | null;
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
            }, import("../types/response").Response<import("../types/response/auth").RecoverAccountResponse>>;
            sendRecoveryURL: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: {
                        ctx_user: import("../types/trpc").CTX_User | null;
                    };
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                _input_in: string;
                _input_out: string;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, import("../types/response").Response<import("../types/response/auth").RecoverAccountSentURLResponse>>;
        }>;
        checkURLStatus: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                ctx_user: import("../types/trpc").CTX_User | null;
            };
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../types/response").Response<import("../types/response/auth").checkURLStatusResponse>>;
    }>;
    user: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: {
            ctx_user: import("../types/trpc").CTX_User | null;
        };
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        fetchUser: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                ctx_user: import("../types/trpc").CTX_User;
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../types/response").Response<import("../types/response/user").FetchUserResponse>>;
    }>;
    mailreadreceipts: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: {
            ctx_user: import("../types/trpc").CTX_User | null;
        };
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        fetchAll: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                ctx_user: import("../types/trpc").CTX_User;
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../types/response").Response<import("../types/response/mailreadreceipts").MailReadReceiptsFetchAllResponse>>;
        createOne: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                ctx_user: import("../types/trpc").CTX_User;
            };
            _input_in: {
                label: string;
            };
            _input_out: {
                label: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../types/response").Response<import("../types/response/mailreadreceipts").MailReadReceiptsCreateEmailResponse>>;
        deleteOne: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                ctx_user: import("../types/trpc").CTX_User;
            };
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../types/response").Response<import("../types/response/mailreadreceipts").MailReadReceiptsDeleteEmailResponse>>;
        seeOne: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    ctx_user: import("../types/trpc").CTX_User | null;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                ctx_user: import("../types/trpc").CTX_User;
            };
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../types/response").Response<import("../types/response/mailreadreceipts").MailReadReceiptsSeeEmailResponse>>;
    }>;
}>;
export type AppRouter = typeof appRouter;
