import {
  Alert,
  Avatar,
  Button,
  Group,
  Stack,
  Text,
  Textarea,
  ActionIcon,
  Title,
} from "@mantine/core";import { getPosts } from "../utils";
import { addPost, deletePost } from "../actions";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import Link from "next/link";
import { format } from "date-fns";
import { IconMinus } from "@tabler/icons-react";

async function PostsPage() {
  const posts = await getPosts();
  const session = await getServerSession(options)
  const addPostAction = addPost.bind(null, session.user.email)

  console.log(posts)

  return (
    <>
        <div>La liste des posts</div>
        <form action={addPostAction}>
            <Stack>
                <Textarea name="content" placeholder="Exprimez-vous..."/>
                <Button type="submit">Publier</Button>
            </Stack>
        </form>
        <Stack gap="md" mt="xl">
            {posts.length === 0 && <Text>Aucun post</Text>}
            {posts.map((post) => {
                const deletePostAction = deletePost.bind(null, session.user.email, post.id)
                return (
                  <Group align="flex-start" key={post.id}>
                    <Avatar src={post.author.image} />
                    <Stack gap="xs" className="grow">
                      <Group align="center">
                        <Text fw="bold">{post.author.name}</Text>
                        <Text fz="xs">
                          {format(post.updatedAt, "dd/MM/yyyy hh:mm:ss")}
                        </Text>
                        {session.user.email === post.author.email && (
                            <form action={deletePostAction}>
                                <ActionIcon type="submit" color="red" radius="120" size="xs">
                                    <IconMinus />
                                </ActionIcon>
                            </form>
                        )}
                      </Group>
                      <Link href={`/posts/${post.id}`} key={post.id}>
                        <Text>{post.content}</Text>
                      </Link>
                      {post._count.comments !== 0 && (
                        <Alert variant="light" color="blue" p="xs">
                          {post._count.comments} commentaires.
                        </Alert>
                      )}
                    </Stack>
                  </Group>
                );
            })}

        </Stack>
    </>
  );
}

export default PostsPage;
