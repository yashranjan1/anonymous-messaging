"use client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {  Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/schemas/signInSchema';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { signIn } from 'next-auth/react';
import Link from "next/link";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const SignInPage = () => {

    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
          identifier: "",
          password: "",
        },
    })

    const [isSubmitting, setIsSubmitting] = useState(false);
    

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        
        const res = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (res?.error) {

            if (res.code === "Invalid identifier or password") {
                toast.error("Invalid login details", {
                    description: "Please try again",
                });
            }
            else if (res.code === "User not found") {
                toast.error("User not found", {
                    description: "Please try again",
                });
            }
            else if (res.code === "User not verified") {
                toast.error("User not verified", {
                    description: "Please try again",
                });
            }
            else {
                toast.error("Sign in failed", {
                    description: "Please try again",
                });
            }

            setIsSubmitting(false);
            return;
        }

        if (res?.url) {
            toast.success("Signed in successful", {
                description: "You've been signed in",
            });
            router.replace(res.url);
            console.log(res.url);
        }
    };


    return (
        <div className='flex-1 flex justify-center items-center'>
            <Card className='w-96 p-0.5 sm:p-5 drop-shadow-lg'>
                <CardHeader className='font-bold text-2xl text-center'>
                    <CardTitle className='r'>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex flex-col items-center'>
                            <FormField
                                name="identifier"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='w-full flex flex-col space-y-3'>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Username" className=''{...field} />
                                        </FormControl>
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
                                            <Input placeholder="Password" type='password' className=''{...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className='w-full' type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </> 
                                    : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className='flex flex-col items-center'>
                    <p className='text-sm sm:text-md'>
                        Don&apos;t have an account? <Link href="/sign-up" className="hover:underline">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );    
};

export default SignInPage;