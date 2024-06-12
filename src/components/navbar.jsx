"use client"
import React from 'react';
import { useRouter } from 'next/navigation'; 
import { Button } from "@/components/ui/button";
import { useSession, signOut } from 'next-auth/react';
import { toast } from './ui/use-toast';

export default function Navbar() {
  const router = useRouter();

  const { data: session } = useSession();

  const handleSignOut = async (e) => {
    e.preventDefault();
    await signOut({ redirect: false },); 
    toast({
      title: "You have signed out successfully.",
    });
    router.push("/signin");
  };

  return (
    <div className='bg-slate-950 text-white flex text-center items-center justify-between p-3'>
      <h1 className='text-2xl font-bold'>MysteryMessage</h1>
      <h1 className='font-bold'>Welcome {session?.user?.username}</h1>
      {session ? (
        <Button className="bg-slate-700" onClick={handleSignOut}>
          Sign Out
        </Button>
      ) : (
        <Button className="bg-slate-700" onClick={() => router.push("/signin")}>
          Sign In
        </Button>
      )}
    </div>
  );
}
