"use client"

import React from 'react';
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form"
import { Input } from "@repo/ui/components/ui/input"
import { Button } from "@repo/ui/components/ui/button"
import { useState } from "react"


const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }).refine(value => value.endsWith('@redingtongroup.com'), {
    message: "Email must be from the domain redingtongroup.com"
  }),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters long",
    })
});

type LoginFields = z.infer<typeof loginFormSchema>;
type States = {
  isPasswordVisible: boolean
}

export function Login() {
  //   const toastUtility = new ToastUtility();
  const router = useRouter();

  const [values, setValues] = useState<States>({
    isPasswordVisible: false,
  })

  const togglePasswordVisibility = () => {
    setValues({
      ...values,
      isPasswordVisible: !values.isPasswordVisible,
    })
  }

  const form = useForm<LoginFields>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (fields: LoginFields) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: fields.email,
        password: fields.password,
      });
      if (result?.ok) {
        
        toast.success('Successfully signed in!')
        router.refresh();
      } else {
        const err = result?.error;
        throw new Error(err as string);
      }
    } catch (error) {
      toast.error('Failed to sign up')
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
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
              {/* <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-2">
          Login
        </Button>
      </form>
    </Form>
  );
}