import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message } from "@/model/User";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";

interface MessageCardProps {
    message: Message;
    onDelete: ( messageId: string ) => void;
    className?: string;
}

const MessageCard = ({ message, onDelete, className }:  MessageCardProps) => {
    
    const handleDeleteConfirm = async () => {

        try {
            await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`
            );
            toast.success("Message deleted", {
                description: "Message has been deleted"
            });
            onDelete(message._id as string);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("An Error Occurred", { 
                description: axiosError.response?.data.message 
            });
        } 
    };
    return ( 
        <>
            <Card className={className + " flex flex-col"}>
                <CardHeader className="flex flex-row items-center">
                    <CardTitle className="flex-1 mt-1.5">Message</CardTitle>
                    <AlertDialog >
                        <AlertDialogTrigger className="" ><X /></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardHeader>
                <CardContent>
                    <p className="text-sm sm:text-base">{message.content}</p>
                </CardContent>
            </Card>
        </>
    );
}
 
export default MessageCard;