import { getServerSession } from 'next-auth'
import React from 'react'
import { options } from '../api/auth/[...nextauth]/options'
import { Avatar, Center, Stack, Text } from '@mantine/core'

async function ProfilePage() {
    const session = await getServerSession(options)
    console.log(session)
  return (
    <Center>
      <Stack align="center">
        <Avatar src={session.user.image} alt="User image" size={120}/>
        <Text>{session.user.name}</Text>
        <Text>{session.user.email}</Text>
      </Stack>
    </Center>
  );
}

export default ProfilePage