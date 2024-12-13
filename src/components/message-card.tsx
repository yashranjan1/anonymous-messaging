import { X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
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
import axios from "axios";

interface MessageCardProps {
    message: Message;
    onDelete: ( messageId: string ) => void;
}

const MessageCard = ({ message, onDelete }:  MessageCardProps) => {

    const handleDeleteConfirm = async () => {
        const res = await axios.delete<ApiResponse>(`/api/delete-messages/${message._id}`);
        toast.success("Message deleted", {
            description: res.data.message,
        });
        onDelete(message._id as string);
    }

    return ( 
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger><X className="h-5 w-5" /></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {handleDeleteConfirm()}}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardHeader>
                <CardContent>

                </CardContent>
                <CardFooter>

                </CardFooter>
            </Card>
        </>
    );
}
 
export default MessageCard;