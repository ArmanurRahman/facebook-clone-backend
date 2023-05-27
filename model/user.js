const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;
const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "first name is required"],
            trim: true,
            text: true,
        },
        lastName: {
            type: String,
            required: [true, "last name is required"],
            trim: true,
            text: true,
        },
        userName: {
            type: String,
            required: [true, "user name is required"],
            trim: true,
            text: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "user name is required"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        picture: {
            type: String,
            default:
                "https://res.cloudinary.com/dt0gg98qf/image/upload/v1682349375/samples/facebook/default_pp_ixgsm0.png",
        },
        cover: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            required: [true, "gender is required"],
            trim: true,
        },
        bYear: {
            type: Number,
            required: true,
            trim: true,
        },
        bMonth: {
            type: Number,
            required: true,
            trim: true,
        },
        bDay: {
            type: Number,
            required: true,
            trim: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        friends: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        followers: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        requests: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        search: [
            {
                user: {
                    type: ObjectId,
                    ref: "User",
                    required: true,
                },
                createdAt: {
                    type: Date,
                    required: true,
                },
            },
        ],
        details: {
            bio: {
                type: String,
            },
            otherName: {
                type: String,
            },
            job: {
                type: String,
            },
            workplace: {
                type: String,
            },
            highSchool: {
                type: String,
            },
            college: {
                type: String,
            },
            currectCity: {
                type: String,
            },
            hometown: {
                type: String,
            },
            relationship: {
                type: String,
                enum: ["Single", "Merried"],
            },
            instagram: {
                type: String,
            },
        },
        savePosts: [
            {
                post: {
                    type: ObjectId,
                    ref: "Post",
                },
                savedAt: {
                    type: Date,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
