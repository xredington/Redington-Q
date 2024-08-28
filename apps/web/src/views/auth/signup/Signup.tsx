"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"



// import { ToastType } from "@/configs/constants.config"
// import { ToastUtility } from "@/utilities"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form"
import { Input } from "@repo/ui/components/ui/input"
import { Button } from "@repo/ui/components/ui/button"
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"


const registerFormSchema = z.object({
    firstName: z.string().min(2, {
        message: "First Name must be at least 2 characters long",
    }),
    lastName: z.string().min(3, {
        message: "Last Name must be at least 3 characters long",
    }),
    email: z.string().email({
        message: "Please enter a valid email",
    }).refine(value => value.endsWith('@redingtongroup.com'), {
        message: "Email must be from the domain redingtongroup.com"
    }),
    password: z
        .string().min(4,
            { message: "Password must be at least 4 characters long" }
        )
    // .refine(
    //     (value) =>
    //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
    //             value,
    //         ),
    //     {
    //         message:
    //             "Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters",
    //     },
    // ),
})

type registerFields = z.infer<typeof registerFormSchema>

type States = {
    isPasswordVisible: boolean
}

export default function SignupForm() {
    // const toastUtility = new ToastUtility()
    const router = useRouter()
    const [values, setValues] = useState<States>({
        isPasswordVisible: false,
    })

    const togglePasswordVisibility = () => {
        setValues({
            ...values,
            isPasswordVisible: !values.isPasswordVisible,
        })
    }

    const form = useForm<registerFields>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = async (fields: registerFields) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: 'POST',
                body: JSON.stringify(fields),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                toast.success('Successfully signed up! You can now log in.')
                router.push(`/login`)
            } else {
                const error = await res.text();
                throw new Error(error);
            }
        } catch (error) {
            toast.error('Failed to sign up')
        }
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={`grid grid-cols-2 justify-between gap-x-3 gap-y-2`}
                >
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className={`col-span-full sm:col-auto`}>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className={`col-span-full sm:col-auto`}>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className={`col-span-full `}>
                                <FormLabel>Email address</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className={`col-span-full`}>
                                <div
                                    className={`w-full flex pb-1 pt-1.5  item-center justify-between`}
                                >
                                    <FormLabel>Password</FormLabel>
                                    {values.isPasswordVisible ? (
                                        <Button variant={'ghost'} type={'button'} className="text-slate-400 text-xs py-0 px-0 h-auto" onClick={togglePasswordVisibility} >hide</Button>
                                    ) : (

                                        <Button variant={'ghost'} type={'button'} className="text-slate-400 text-xs py-0 px-0 h-auto" onClick={togglePasswordVisibility} >show</Button>

                                    )}
                                </div>
                                <FormControl>
                                    <Input
                                        type={values.isPasswordVisible ? "text" : "password"}
                                        placeholder=""
                                        {...field}
                                    />
                                </FormControl>
                                <p className={`text-[10px] text-stone-500 3xl:text-xs`}>
                                    Use 8 or more characters with a mix of upper & lower case
                                    letters, numbers & symbols
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* <p className="text-xs col-span-full max-w-md text-gray-500 pt-3 text-left 3xl:text-sm">
                        By creating an account, you agree to our
                        <br />
                        <Link
                            href="/legal/terms"
                            className="font-semibold underline text-neutral-900 hover:text-green-600"
                        >
                            Terms of use
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/legal/privacy"
                            className="font-semibold underline text-neutral-900 hover:text-green-600"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p> */}
                    <Button
                        className="w-full mt-2 col-span-full flex justify-center items-center"
                        type="submit"
                    >
                        Apply
                    </Button>
                </form>
            </Form>
        </>
    )
}
