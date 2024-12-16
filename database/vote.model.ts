import { model, models, Schema, Types, Document } from "mongoose";

import { VoteType, ActionType } from "@/types/model";

export interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: ActionType;
  voteType: ActionType;
}

export interface IVoteDoc extends IVote, Document {}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: {
      type: String,
      enum: [ActionType.Question, ActionType.Answer],
      required: true,
    },
    voteType: {
      type: String,
      enum: [VoteType.UpVote, VoteType.DownVote],
      required: true,
    },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
