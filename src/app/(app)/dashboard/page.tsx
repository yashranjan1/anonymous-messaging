"use client";

import { useCallback, useEffect, useState } from "react";
import { Message } from "@/model/User";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";
import { Check, Clipboard, Loader2 } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageCard from "@/components/message-card";
import { set } from "mongoose";
import { Skeleton } from "@/components/ui/skeleton";
  


const Page = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    const [username, setUsername] = useState("");

    const handleDeleteMessage = async (messageId: string) => {
        setMessages(messages.filter(message => message._id !== messageId));
    }

    const { data: session } = useSession();

    const form = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register, watch, setValue } = form;

    const acceptMessage = watch("acceptMessages");

    const fetchAcceptanceStatus = useCallback(async () => {
        setIsSwitching(true);
        try {
            const response = await axios.get<ApiResponse>(`/api/accept-message`);
            setValue("acceptMessages", response.data.isAcceptingMessages as boolean);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("An Error Occurred", {
                description: axiosError.response?.data.message,
            });
        } finally {
            setIsLoading(false);
        }
    }, [setValue]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitching(false);
        try {
            const response = await axios.get<ApiResponse>(`/api/get-messages`);
            setMessages(response.data.messages as Message[]);
            if (refresh) {
                toast.success("Messages refreshed", {
                    description: "Messages have been refreshed",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            if (axiosError.response?.data.message !== "You have no messages") {
                toast.error("An Error Occurred", {
                    description: axiosError.response?.data.message,
                });
            }
        } finally {
            setIsLoading(false);
            setIsSwitching(false);
        }
    }, [setMessages, setIsLoading]);

    useEffect(() => {
        if (!session || !session.user) {
            return;
        }
        setUsername(session.user.username);
        fetchAcceptanceStatus();
        fetchMessages();
    }, [session, setValue, fetchAcceptanceStatus, fetchMessages]);

    const handleSwitchChange = async () => {
        try {
            const res = await axios.post<ApiResponse>("/api/accept-message", {
                acceptMessages: !acceptMessage,
            });
            setValue("acceptMessages", !acceptMessage);
            toast.success(res.data.message, {
                description: "Message acceptance status updated",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            if (axiosError.response?.data.message !== "You have no messages") {
                toast.error("An Error Occurred", {
                    description: axiosError.response?.data.message,
                });
            }
        } 
    }

    const baseUrl = `${window.location.origin}/u/`;

    const [tick, setTick] = useState(false);
    
    const copyLink = () => {
        navigator.clipboard.writeText(baseUrl);
        toast.success("Link copied to clipboard", {
            description: "Share this link with people to get feedback",
        });
        setTick(true);
        setTimeout(() => {
            setTick(false);
        }, 1500);
    }

    return ( 
        <>
            <div className="flex-1 grid grid-cols-12 gap-5 sm:gap-10 mt-10 sm:mt-16 grid-rows-[auto,1fr]">
                <div className="col-span-12 flex flex-col justify-start lg:flex-row items-center gap-5">
                    <h1 className="text-4xl font-bold tracking-wide sm:text-5xl text-left flex-1">Inbox</h1>
                    <div className="flex flex-col sm:flex-row gap-5 items-center">                    
                        <Card className="p-2 max-w-fit flex items-center gap-6">
                            {
                                username.length > 0 &&
                                
                                <Label className="p-2 font-[family-name:var(--font-geist-mono)] text-xs sm:text-md">{baseUrl + username }</Label>
                            }
                            {
                                username.length === 0 &&
                                <Skeleton className="h-4 w-[200px] ml-1 rounded-full" />
                            }
                            { !tick && 
                                <Clipboard className="lucide-icon px-3 py-3 me-0.5 rounded cursor-pointer hover:bg-zinc-800/90" size={15} onClick={copyLink} />
                            }
                            { tick && 
                                <Check className="lucide-icon px-2 py-2 me-0.5" size={23}/>
                            }
                        </Card>
                        <HoverCard>
                            <HoverCardTrigger className="flex sm:block items-center gap-4 sm:gap-0">
                                <p className="flex sm:hidden">Accept anonymous feedback</p>
                                <Switch className="me-2"
                                    {...register("acceptMessages")}
                                    checked={acceptMessage}
                                    onCheckedChange={handleSwitchChange}
                                    disabled={isSwitching}
                                    />
                            </HoverCardTrigger>
                            <HoverCardContent align="end" className="mt-4 max-w-fit">
                                Flipping this switch enables receiving anonymous feedback.
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
                {
                    messages.length > 0 &&
                    <ScrollArea className="grid grid-cols-2 gap-2">
                        {messages.map((message, index) => (
                            <MessageCard key={message._id as string} 
                                message={message} 
                                onDelete={handleDeleteMessage} />
                        ))}
                    </ScrollArea>
                }
                {
                    messages.length == 0 &&
                    <div className="flex flex-col gap-3 items-center justify-center min-w-full col-span-12 mb-24">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-5xl text-center">No messages</h1>
                        <p className="text-sm sm:text-2xl font-thin text-center">You have no messages right now, share your link with your friends to get feedback!</p>
                    </div>
                }
            </div>
        </>
    );
}
 
export default Page;