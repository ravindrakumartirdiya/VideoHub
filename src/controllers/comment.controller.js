import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 }, 
        populate: [
            { path: 'user', select: 'username' }, 
            { path: 'video', select: 'title' },
        ]
    };

    const aggregateQuery = Comment.aggregate([
        { $match: { video: mongoose.Types.ObjectId(videoId) } }
    ]);

    const comments = await Comment.aggregatePaginate(aggregateQuery, options);

    res.json(new ApiResponse(comments.docs, {
        page: comments.page,
        limit: comments.limit,
        totalPages: comments.totalPages,
        totalDocs: comments.totalDocs
    }));
});

// Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { userId, content } = req.body;

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = new Comment({
        video: videoId,
        owner: userId,
        content,
    });

    await comment.save();

    res.status(201).json(new ApiResponse(comment, "Comment added successfully"));
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    comment.content = content;
    await comment.save();

    res.json(new ApiResponse(comment, "Comment updated successfully"));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    await comment.remove();

    res.json(new ApiResponse(null, "Comment deleted successfully"));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};
