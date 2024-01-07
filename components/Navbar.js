"use client";

import { Button } from '@mantine/core';
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link'

function Navbar({ session }) {
  return (
    <nav className="flex justify-between p-4 text-white bg-black">
      <div>Logo</div>
      <div className="flex gap-3">
        <Link href="/">Home</Link>
        {session && <Link href="/posts">Posts</Link>}
        {session && <Link href="/profile">Profile</Link>}
      </div>
      <div>
        {session ? (
          <Button
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
          >
            Sign Out
          </Button>
        ) : (
          <Button onClick={() => signIn()}>Sign In</Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar