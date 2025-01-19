import { TRPCClientError } from "@trpc/client"
export const handleTRPCError = (message: string, error: any) => {
    console.error( error instanceof TRPCClientError ?  error.message : error);
    return message
}

