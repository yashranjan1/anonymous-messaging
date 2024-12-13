"use client";

import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { messageSchema } from "@/schemas/messageSchema";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";

const Page = () => {


    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ""
        }
    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    const params = useParams();
    const { username } = params;

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/api/send-message`, {
                username,
                content: data.content
            });

            toast.success("Feedback sent!", {
                description: "Your feedback has been sent successfully"
            });
            
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 403) {
                toast.error("You are not accepting messages", {
                    description: "You have to accept messages before you can send feedback"
                });
                return;
            }
            else if (axiosError.response?.status === 404) {
                toast.error("User not found", {
                    description: "User not found. Please try again"
                });
                return;
            }
            else {
                toast.error("Something went wrong!", {
                    description: "Couldn't send feedback right now. Try again later" 
                });
            }
        } finally {
            setIsSubmitting(false);
            form.reset();
        }
    }

    return (
        <div className="flex-1 flex flex-col items-center gap-5 sm:gap-14 p-3 sm:p-0">
            <h1 className="text-xl font-bold tracking-wide sm:text-5xl text-center">Give <code>@{username}</code> your feedback!</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col justify-center gap-3 items-center'>
                    <FormField
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className='w-full flex flex-col gap-2 items-center'>
                                <FormControl>
                                    <Textarea 
                                        placeholder="Your feedback..." 
                                        className="w-full"
                                        {...field}
                                        rows={12}
                                    />
                                </FormControl>
                                <FormDescription className="text-center">
                                    <span>@{ username }</span> will see your feedback, without seeing your name. Please keep the criticism/feedback civil and constructive
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {
                            isSubmitting ? 
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                                : "Submit"
                        }
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default Page;