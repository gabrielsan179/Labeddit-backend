import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CreateCommentInput, GetCommentsInput, EditCommentInput, DeleteCommentInput, LikeOrDislikeCommentInput } from "../dtos/commentDTO";
import { BaseError } from "../errors/BaseError";

export class CommentController {
    constructor(
        private commentBusiness: CommentBusiness
    ) { }

    public getComments = async (req: Request, res: Response) => {
        try {
            const input: GetCommentsInput = {
                token: req.headers.authorization
            }

            const output = await this.commentBusiness.getComments(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createComment = async (req: Request, res: Response) => {
        try {
            const input: CreateCommentInput = {
                token: req.headers.authorization,
                idPost: req.params.id,
                content: req.body.content
            }

            await this.commentBusiness.createComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
    public editComment = async (req: Request, res: Response) => {
        try {
            const input: EditCommentInput = {
                idToEdit: req.params.id,
                token: req.headers.authorization,
                content: req.body.content
            }

            await this.commentBusiness.editComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input: DeleteCommentInput = {
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            await this.commentBusiness.deleteComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
    public LikeOrDislikeComment = async (req: Request, res: Response) => {
        try {
            const input: LikeOrDislikeCommentInput = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.commentBusiness.LikeOrDislikeComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}