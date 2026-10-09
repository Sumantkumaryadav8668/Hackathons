import * as z from "zod"

export const signupValidator = z.object({
    name:
        z.string()
        .trim()
        .min(3,"minimum lenght of name should be 3")
        .max(20,"maximum lenght of name should be 20"),
    
    email: z.preprocess(
        (value)=> typeof value == "string" ? value.trim().toLowerCase():"",
        z.string().email("Email must be valid")
    ),

    password:
        z.string()
        .min(6,"minimum length of password should be 6")
        .max(12,"maximum length of password should be 12")
        .regex(/[A-Z]/,"your password have should be atleast one capital latter")
        .regex(/[a-z]/,"your password have should be atleast one small latter")
        .regex(/[0-9]/,"your password have should be atleast one number")
        .regex(/[@#$%^&*()!_><?/~]/,"your password have should be atleast one spacial charecter"),


   phone: z.preprocess(
        (value) => String(value),
        z.string().regex(/^[6-9]\d{9}$/,"Enter a valid 10-digit phone number")
)
})




export const loginValidator = z.object({
    email: z.preprocess(
        (val)=>{
            return typeof val == "string" ? val.trim().toLowerCase():""
        },
        z.string().email("Email must be valid")
    ),

    password:
        z.string()
        .min(8,"minimum length of password should be 8")
        .max(15,"maximum length of password should be 15")
        .regex(/[A-Z]/,"your password have should be atlist 1 capital letter")
        .regex(/[a-z]/,"your password have should be atlist 1 small letter")
        .regex(/[0-9]/,"your password have should be atlist 1 number")
        .regex(/[!@#$%^&*().,';?/<>{}|]/,"your password have should be atlist 1 spacial character")
})