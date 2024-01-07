import React from 'react'
import { getPost } from '@/app/utils'
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
import { format } from "date-fns";
import { addCommentPost, deleteCommentPost } from '@/app/actions';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';

async function PostPage({ params }) {
  const post = await getPost(params.id)
  const session = await getServerSession(options)

  console.log(post)

  const addCommentPostAction = addCommentPost.bind(null, session.user.email, post.id)
  return (
    <div>
      <Stack gap="md" mt="xl">
        <Paper withBorder p="md">
          <Group align="flex-start" key={post.id}>
            <Avatar src={post.author.image} />
            <Stack gap="xs">
              <Group>
                <Text fw="bold">{post.author.name}</Text>
                <Text fz="xs">
                  {format(post.updatedAt, "dd/MM/yyyy hh:mm:ss")}
                </Text>
              </Group>
              <Text>{post.content}</Text>
            </Stack>
          </Group>
        </Paper>
        <Title>Réponses</Title>
        <form action={addCommentPostAction}>
            <Stack>
              <Textarea name="content" placeholder="Exprimez-vous..." />
              <Button type="submit">Envoyer</Button>
            </Stack>
        </form>
        {post.comments.length === 0 && <Text>Aucun commentaire.</Text>}
        {post.comments.map((comment) => {
          let deleteCommentPostAction = deleteCommentPost.bind(null, session.user.email, comment.id)
          return (
            <Group align="flex-start" key={post.id}>
              <Avatar src={comment.author.image} />
              <Stack gap="xs">
                <Group>
                  <Text fw="bold">{comment.author.name}</Text>
                  <Text fz="xs">
                    {format(comment.updatedAt, "dd/MM/yyyy hh:mm:ss")}
                  </Text>
                  {session.user.email === comment.author.email && (
                    <form action={deleteCommentPostAction}>
                      <ActionIcon type="submit" color="red" radius="120" size="xs">
                        <IconMinus />
                      </ActionIcon>
                    </form>
                  )}
                </Group>
                <Text>{comment.content}</Text>
              </Stack>
            </Group>
          );
        })}
      </Stack>
    </div>
  );
}

export default PostPage