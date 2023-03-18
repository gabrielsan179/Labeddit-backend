import { PostDatabase } from './../database/PostDatabase';
import { Comment } from '../models/Comment';
import { CommentDatabase } from "../database/CommentDatabase"
import { CreateCommentInput, DeleteCommentInput, EditCommentInput, GetCommentsInput, GetCommentsOutput, LikeOrDislikeCommentInput } from "../dtos/commentDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { USER_ROLES, likeDislikeCommentDB } from '../types';
import { Post } from '../models/Post';

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public getComments = async (input: GetCommentsInput): Promise<GetCommentsOutput> => {
        const { token } = input

        if (!token) {
            throw new BadRequestError("Token não enviado");
        }

        const payload = this.tokenManager.getPayload(token as string)

        if (payload === null) {
            throw new BadRequestError("Token inválido");
        }

        const commentsWithCreatorDB = await this.commentDatabase.findCommentWithCreator()

        const commentsWithCreator = commentsWithCreatorDB.map((commentWithCreatorDB) => {
            const commentWithCreator = new Comment(
                commentWithCreatorDB.id,
                commentWithCreatorDB.content,
                commentWithCreatorDB.post_id,
                commentWithCreatorDB.likes,
                commentWithCreatorDB.dislikes,
                commentWithCreatorDB.created_at,
                commentWithCreatorDB.updated_at,
                commentWithCreatorDB.creator_id,
                commentWithCreatorDB.creator_name
            )
            return commentWithCreator.toBusinessModel()
        })

        const output: GetCommentsOutput = commentsWithCreator

        return output
    }

    public createComment = async (input: CreateCommentInput): Promise<void> => {
        const { token, idPost, content } = input

        if (!token) {
            throw new BadRequestError("Token não enviado");
        }

        const payload = this.tokenManager.getPayload(token as string)

        if (payload === null) {
            throw new BadRequestError("Token inválido");
        }

        const postDB = await this.postDatabase.findPostsWithCreatorById(idPost)

        if (!postDB) {
            throw new NotFoundError("id informada não encontrada")
        }

        if (!content) {
            throw new BadRequestError("'content' obrigatório para criar um comment")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const id = this.idGenerator.generate()

        const commentDB = await this.commentDatabase.findCommentById(id)

        if (commentDB) {
            throw new BadRequestError("erro ao gerar ID, execute o endpoint novamente")
        }

        const newPost = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.comments,
            postDB.created_at,
            postDB.updated_at,
            postDB.creator_id,
            postDB.creator_name
        )

        newPost.addComments()

        const newComment = new Comment(
            id,
            idPost,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )

        const newCommentDB = newComment.toDBModel()

        await this.commentDatabase.insertComment(newCommentDB)

        const newPostDB = newPost.toDBModel()

        await this.postDatabase.updatePost(idPost, newPostDB)
    }

    public editComment = async (input: EditCommentInput): Promise<void> => {
        const { idToEdit, token, content } = input

        if (!token) {
            throw new BadRequestError("Token não enviado");
        }

        const payload = this.tokenManager.getPayload(token as string)

        if (payload === null) {
            throw new BadRequestError("Token inválido");
        }

        const commentDB = await this.commentDatabase.findCommentById(idToEdit)

        if (!commentDB) {
            throw new NotFoundError("id informada não encontrada")
        }

        if (payload.id !== commentDB.creator_id) {
            throw new BadRequestError("apenar o criador do post pode editá-la")
        }

        if (!content) {
            throw new BadRequestError("'content' obrigatório para criar um post")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const newComment = new Comment(
            idToEdit,
            commentDB.post_id,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.created_at,
            commentDB.updated_at,
            payload.id,
            payload.name
        )
        newComment.setContent(content)
        newComment.setUpdatedAt(new Date().toISOString())

        const newCommentDB = newComment.toDBModel()

        await this.commentDatabase.updateComment(idToEdit, newCommentDB)
    }

    public deleteComment = async (input: DeleteCommentInput): Promise<void> => {
        const { idToDelete, token } = input

        if (!token) {
            throw new BadRequestError("Token não enviado");
        }

        const payload = this.tokenManager.getPayload(token as string)

        if (payload === null) {
            throw new BadRequestError("Token inválido");
        }

        const commentDB = await this.commentDatabase.findCommentById(idToDelete)

        if (!commentDB) {
            throw new NotFoundError("id informada não encontrada")
        }

        if (payload.role === USER_ROLES.ADMIN) {
            await this.commentDatabase.deleteComment(idToDelete)
        }

        if (payload.role !== USER_ROLES.ADMIN && payload.id !== commentDB.creator_id) {
            throw new BadRequestError("apenar o criador do post pode deletá-lo")
        }

        await this.commentDatabase.deleteComment(idToDelete)
    }

    public LikeOrDislikeComment = async (input: LikeOrDislikeCommentInput): Promise<void> => {
        const { idToLikeOrDislike, token, like } = input

        if (!token) {
            throw new BadRequestError("Token não enviado");
        }

        const payload = this.tokenManager.getPayload(token as string)

        if (payload === null) {
            throw new BadRequestError("Token inválido");
        }

        const commentDB = await this.commentDatabase.findCommentsWithCreatorById(idToLikeOrDislike)

        if (!commentDB) {
            throw new NotFoundError("id informada não encontrada")
        }

        if (payload.id === commentDB.creator_id) {
            throw new BadRequestError("o criador do post não pode dar like ou dislike")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }

        const newlikeOrDislike: likeDislikeCommentDB = {
            user_id: payload.id,
            comment_id: idToLikeOrDislike,
            like: like ? 1 : 0
        }

        const newComment = new Comment(
            commentDB.id,
            commentDB.post_id,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.created_at,
            commentDB.updated_at,
            commentDB.creator_id,
            commentDB.creator_name
        )

        const likeDislikeExist = await this.commentDatabase.findLikesDislikesComment(newlikeOrDislike)

        if (!likeDislikeExist) {
            await this.commentDatabase.likeOrDislikeComment(newlikeOrDislike)
            like ? newComment.addLikes() : newComment.addDislikes()
        } else {
            if (likeDislikeExist.like === 1) {
                if (like) {
                    await this.commentDatabase.deleteLikesDislikesComment(newlikeOrDislike)
                    newComment.removeLikes()
                } else {
                    await this.commentDatabase.updateLikesDislikesComment(newlikeOrDislike)
                    newComment.removeLikes()
                    newComment.addDislikes()
                }
            } else if (likeDislikeExist.like === 0) {
                if (like) {
                    await this.commentDatabase.updateLikesDislikesComment(newlikeOrDislike)
                    newComment.removeDislikes()
                    newComment.addLikes()
                } else {
                    await this.commentDatabase.deleteLikesDislikesComment(newlikeOrDislike)
                    newComment.removeDislikes()
                }
            }
        }

        const newCommentDB = newComment.toDBModel()

        await this.commentDatabase.updateComment(idToLikeOrDislike, newCommentDB)
    }
}