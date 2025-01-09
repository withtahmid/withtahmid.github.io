import { z } from "zod";
export const usernameSchema = z
.string()
.min(3, { message: "Username must be at least 3 characters long" })
.max(20, { message: "Username must not exceed 20 characters" })
.regex(/^[a-z][a-z0-9._]*$/, {
    message: "Username must start with a letter, contain only lowercase letters, numbers, underscores(_), or dots(.)."
});
export const nameSchema = z
.string()
.min(3, { message: "Name must be at least 3 characters long" })
.max(30, { message: "Username must not exceed 20 characters" })
.regex(
  /^[A-Za-z]+([ '.-][A-Za-z]+)*$/,
  {
    message: "Name must consist of letters, spaces, periods, hyphens, or apostrophes only, and cannot start or end with a space or special character."
  }
);

export const emailSchema = z
.string()
.email({ message: "Invalid email address format" })

export const passwordSchema = z
.string()
.min(8, { message: "Password must be at least 8 characters long" })
.max(50, { message: "Password must be no more than 50 characters long" })
.regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
  {
    message: "Password must be 8-32 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &)."
  }
);

export const LoginSchema = z
.object({
  emailOrUsername: usernameSchema.or(emailSchema),
  password: passwordSchema
});


export const signupFormSchema = z
.object({
  username: usernameSchema,
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
});

export const parseZodError = (check: any) => {
  const errors = check.error.errors
  const error: any = {};
  errors.forEach((e: any )=> {
    if(!error[e.path[0]]){
      error[e.path[0]] = e.message;
    }
  });
  return error;
}