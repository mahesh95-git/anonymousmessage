"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw, X } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

export default function Page() {
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const { data: session, update } = useSession();
console.log(session)
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `http://localhost:3000/message/${session?.user?.username}`
    );
    toast({
      title: "Link Copied",
    });
  };

  useEffect(() => {
    const accept = session?.user?.isAcceptingMessages;
    setAcceptMessages(accept);

    const getMessages = async () => {
      setIsLoading(true);
      try {
        const message = await axios.get("api/user/messages");
        if (message.data.success) {
          setMessages(message.data.data?.messages || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getMessages();
  }, [ refresh]);

  const handleDeleteMessage = async (id) => {
    try {
      const response = await axios.delete(`api/user/messages/?messageId=${id}`);
      if (response.data.success) {
        toast({
          title: response.data.message,
        });
        setRefresh(!refresh);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
      });
    }
  };

  const handleIsAcceptingMessages = async (checked) => {  
    console.log(checked);

    setIsSwitchLoading(true);
    try {
      const response = await axios.post("api/user/acceptmessage", {
        isAcceptMessage: checked,
      });

      console.log(response);
      if (response.data.success) {
        toast({
          title: response.data.message,
        });
        update({
          user: {
            ...session.user,
            isAcceptingMessages: checked,
          },
        });
        setAcceptMessages(checked);
      }
    } catch (error) {
      toast({
        title: error.response.data.message,
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };
  return (
    <div className="p-4 w-full">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={`http://localhost:3000/message/${session?.user?.username}`}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={handleCopy}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleIsAcceptingMessages}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 flex justify-around gap-2 flex-wrap ">
        {messages?.length > 0 ? (
          messages?.map((messages) => (
            <Card className="w-1/3 relative " key={messages._id}>
              <CardHeader>
                <CardTitle>{messages.message}</CardTitle>
                <CardDescription>
                  {new Date(messages.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>

              <AlertDialog>
                <AlertDialogTrigger>
                  <Button className="bg-red-500 absolute top-2 right-3">
                    <X />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this message.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteMessage(messages._id)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          ))
        ) : (
          <div>
            <p>No messages found</p>
          </div>
        )}
      </div>
    </div>
  );
}
