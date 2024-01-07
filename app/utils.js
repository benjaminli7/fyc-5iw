import { cache } from "react";
import prisma from "./prisma";

export const getPosts = cache(async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      content: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return posts;
});

export const getPost = cache(async (postId) => {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(postId),
    },
    select: {
      id: true,
      content: true,
      updatedAt: true,
      comments: {
        select: {
          id: true,
          content: true,
          updatedAt: true,
          author: {
            select: {
              email: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return post;
});

