"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts"
import { signUpSchema } from "@/schemas/signUpSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { set } from "mongoose";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle,  CardContent, CardFooter } from '@/components/ui/card';
import {  Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react";

const Page = () : React.ReactElement => {

    const router = useRouter();

    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 500);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
          username: "",
          email: "",
          password: "",
        },
    });

    useEffect(() => {

        const checkUsernameUniqueness = async () => {

            if (username) {
                setIsCheckingUsername(true);
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);

                    setUsernameMessage(response.data.message);

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
                }
                finally {
                    setIsCheckingUsername(false);
                }
            }
            else {
                setUsernameMessage("");
            }
        }

        checkUsernameUniqueness();
        
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data);
            if (response.status === 201) {
                toast.success("Sign up successful", {
                    description: "You can now sign in with your new account",
                });
                router.push("/sign-in");
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Error while signing up", {
                description: axiosError.response?.data.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className='flex flex-col items-center justify-center h-screen font-[family-name:var(--font-geist-sans)]'>
                <Card className='w-96 p-5 drop-shadow-lg'>
                    <CardHeader className='font-bold text-2xl text-center'>
                        <CardTitle className='r'>Sign up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 flex flex-col items-center">
                                <FormField
                                    name="username"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className='w-full flex flex-col space-y-3'>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username" 
                                                className='' {...field} 
                                                onChange={(e) => {
                                                        field.onChange(e)
                                                        debounced(e.target.value)
                                                    }
                                                }
                                                />
                                            </FormControl>
                                            
                                            {   
                                                isCheckingUsername && 
                                                <Loader2 className="animate-spin" />
                                            }
                                            {
                                                usernameMessage && 
                                                <p className={`text-sm ${ usernameMessage === "Username is unique" ? "text-green-900" : "text-red-500" }`}>{usernameMessage}</p>
                                            }
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="email"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className='w-full flex flex-col space-y-3'>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className='w-full flex flex-col space-y-3'>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Password" type='password' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className='w-full' type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing up...
                                        </> 
                                        : "Sign up"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center">
                        <p>
                            Already have an account? <Link href="/sign-in" className="hover:underline">Sign in</Link>
                        </p>
                    </CardFooter>
            </Card>
      </div>
        </>
    )
}

export default Page;