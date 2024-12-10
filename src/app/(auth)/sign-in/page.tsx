"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {  Input } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/schemas/signInSchema';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button";

import { z } from "zod";
import { useSession } from 'next-auth/react';

const page = () => {

    const { data: session } = useSession();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
          identifier: "",
          password: "",
        },
      })


    return (
        <div className='flex flex-col items-center justify-center h-screen font-[family-name:var(--font-geist-sans)]'>
            <Card className='w-96 p-5'>
                <CardHeader className='font-bold text-2xl text-center'>
                    <CardTitle className='r'>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="w-full space-y-6 flex flex-col items-center">
                            <FormField
                                control={form.control}
                                name="identifier"
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
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className='w-full flex flex-col space-y-3'>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Password" type='password' className=''{...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full'>Sign In</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                </CardFooter>
        </Card>
      </div>
    );    
};

export default page;