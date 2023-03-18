import { CommentModel } from '../types';

export interface GetCommentsInput {
    token: string | undefined
}

export type GetCommentsOutput = CommentModel[]

export interface CreateCommentInput {
    token: string | undefined,
    idPost: string,
    content: unknown
}

export interface EditCommentInput {
    idToEdit: string,
    token: string | undefined,
    content: unknown
}

export interface DeleteCommentInput {
    idToDelete: string,
    token: string | undefined
}

export interface LikeOrDislikeCommentInput {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}
