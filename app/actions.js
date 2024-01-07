"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { Truculenta } from "next/font/google";

export async function addPost(userEmail, formData) {
    const content = formData.get("content");
    try {
        await prisma.post.create({
            data: {
                content: content,
                author: {
                    connect: {
                        email: userEmail
                    }
                }
            }
        })
        console.log("Post added")
        revalidatePath("/posts")
    } catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export async function deletePost(userEmail, postId) {
    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(postId)
        },
        select: {
            author: {
                select: {
                    email: true
                }
            }
        }
    })

    if(post.author.email !== userEmail) {
        return {
            error: "Vous n'êtes pas l'auteur de ce post"
        }
    }

    try {
        await prisma.post.delete({
            where: {
                id: parseInt(postId)
            }
        })
        console.log("Post deleted")
        revalidatePath("/posts")
    } catch (e) {
        console.log(e.message)
        return {
            error: e.message
        }
    }
}

export async function addCommentPost(userEmail, postId, formData) {
    const content = formData.get("content");
    try {
        await prisma.comment.create({
            data: {
                content: content,
                author: {
                    connect: {
                        email: userEmail
                    }
                },
                post: {
                    connect: {
                        id: parseInt(postId)
                    }
                }
            }
        })
        console.log("Comment added")
        revalidatePath(`/posts/${postId}`)
    } catch (e) {
        console.log(e.message)
        return {
            error: e.message
        }
    }
}


export async function deleteCommentPost(userEmail, commentId) {
    const comment = await prisma.comment.findUnique({
        where: {
            id: parseInt(commentId)
        },
        select: {
            author: {
                select: {
                    email: true,
                }
            },
            post: {
                select: {
                    id: true
                }
            }
        }
    })

    if(comment.author.email !== userEmail) {
        return {
            error: "Vous n'êtes pas l'auteur de ce commentaire"
        }
    }

    try {
        await prisma.comment.delete({
            where: {
                id: parseInt(commentId)
            }
        })
        revalidatePath(`/posts/${comment.post.id}`)
    } catch (e) {
        console.log(e.message)
        return {
            error: e.message
        }
    }
}