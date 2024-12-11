"use client";

import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import Link from 'next/link';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

const Page = () => {

    const router = useRouter();
    const param = useParams<{
        username: string;
    }>();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
          verifyCode: ""
        },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const res = await axios.post(`/api/verify-code`, {
                username: param.username,
                code: data.verifyCode,
            });
            if (res.data.success) {
                toast.success("User verified successfully", {
                    description: "You can now sign in",
                });
                router.push("/sign-in");
            }
            else {
                toast.error(res.data.message, {
                    description: "Please try again",
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Error verifying user");
        }
    };

    return ( 
        <>
            <div className='flex flex-col items-center justify-center h-screen font-[family-name:var(--font-geist-sans)]'>
                <Card className='w-96 p-5 drop-shadow-lg'>
                    <CardHeader className='font-bold text-2xl text-center'>
                        <CardTitle className='r'>Verify your account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 flex flex-col items-center">
                                <FormField
                                    name="verifyCode"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className='w-full flex flex-col space-y-3 text-center'>
                                            <FormLabel>Input your verification code</FormLabel>
                                            <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button className='w-full' type="submit">Verify</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        
        </> 
    );
}
 
export default Page;

