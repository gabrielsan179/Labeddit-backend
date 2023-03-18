import { CommentWithCreatorDB } from './../types';
import { Post } from './../models/Post';
import { PostDB, PostWithCreatorDB, likeDislikePostDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES_POST = "likes_dislikes_post"

    public async findPostsWithCreator() {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.comments",
                "posts.created_at",
                "posts.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
        return result
    }

    public async findPostWithCreatorAndComments(id: string) {
        const [post]: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.comments",
                "posts.created_at",
                "posts.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where("posts.id", id)
        const allComments: CommentWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_COMMENTS)
            .select(
                "comments.id",
                "comments.creator_id",
                "comments.post_id",
                "comments.content",
                "comments.likes",
                "comments.dislikes",
                "comments.created_at",
                "comments.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "comments.creator_id", "=", "users.id")
            .where("comments.post_id", id)
        const result = {...post, allComments}
        return result
    }

    public async findPostById(id: string) {
        const [postDB]: PostDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id })

        return postDB
    }

    public async insertPost(newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async updatePost(idToEdit: string, newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(newPostDB)
            .where({ id: idToEdit })
    }

    public async deletePost(idToDelete: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .del()
            .where({ id: idToDelete })
    }
    public async findPostsWithCreatorById(postId: string) {
        const [result]: PostWithCreatorDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.comments",
                "posts.created_at",
                "posts.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where( "posts.id", postId )
        return result
    }
    public async likeOrDislikePost(newlikeOrDislike: likeDislikePostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .insert(newlikeOrDislike)
    }
    public async findLikesDislikes(newlikeOrDislike: likeDislikePostDB) {
        const [result]: likeDislikePostDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .where({
                user_id: newlikeOrDislike.user_id,
                post_id: newlikeOrDislike.post_id
            })
        return result
    }
    public async deleteLikesDislikes(newlikeOrDislike: likeDislikePostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .del()
            .where({
                user_id: newlikeOrDislike.user_id,
                post_id: newlikeOrDislike.post_id
            })
    }
    public async updateLikesDislikes(newlikeOrDislike: likeDislikePostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .update(newlikeOrDislike)
            .where({
                user_id: newlikeOrDislike.user_id,
                post_id: newlikeOrDislike.post_id
            })
    }
}