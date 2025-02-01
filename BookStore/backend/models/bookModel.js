import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
    {
        Title: {
            type: String,
            require: true,
        },
        Author: {
            type: String,
            require: true,
        },
        PublishYear: {
            type: Number,
            require: true,
        },
        ISBN: {
            type: Number,
            require: true,
        },
        ImageURL: {
            type: String,
            require: true,
        },
        AmazonURL: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true
    }
);



export const Book = mongoose.model('Books', bookSchema);