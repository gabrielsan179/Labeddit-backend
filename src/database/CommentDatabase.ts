import { CommentDB, CommentWithCreatorDB, likeDislikeCommentDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES_COMMENT = "likes_dislikes_comment"

    public async findCommentWithCreator() {
        const result: CommentWithCreatorDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
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
        return result
    }

    public async findCommentById(id: string) {
        const [commentDB]: CommentDB[] | undefined[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .where({ id })

        return commentDB
    }

    public async insertComment(newCommentDB: CommentDB) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(newCommentDB)
    }

    public async updateComment(idToEdit: string, newCommentDB: CommentDB) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update(newCommentDB)
            .where({ id: idToEdit })
    }

    public async deleteComment(idToDelete: string) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .del()
            .where({ id: idToDelete })
    }
    public async findCommentsWithCreatorById(commentId: string) {
        const [result]: CommentWithCreatorDB[] | undefined[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
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
            .where( "comments.id", commentId )
        return result
    }
    public async likeOrDislikeComment(newlikeOrDislike: likeDislikeCommentDB) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENT)
            .insert(newlikeOrDislike)
    }
    public async findLikesDislikesComment(newlikeOrDislike: likeDislikeCommentDB) {
        const [result]: likeDislikeCommentDB[] | undefined[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENT)
            .where({
                user_id: newlikeOrDislike.user_id,
                comment_id: newlikeOrDislike.comment_id
            })
        return result
    }
    public async deleteLikesDislikesComment(newlikeOrDislike: likeDislikeCommentDB) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENT)
            .del()
            .where({
                user_id: newlikeOrDislike.user_id,
                comment_id: newlikeOrDislike.comment_id
            })
    }
    public async updateLikesDislikesComment(newlikeOrDislike: likeDislikeCommentDB) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENT)
            .update(newlikeOrDislike)
            .where({
                user_id: newlikeOrDislike.user_id,
                comment_id: newlikeOrDislike.comment_id
            })
    }
}