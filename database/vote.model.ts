import { model, models, Schema, Types } from "mongoose";

import { VoteType, ActionType } from "@/types/model";

export interface IVote {
  author: Types.ObjectId;
  id: Types.ObjectId;
  type: ActionType;
  voteType: ActionType;
}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: {
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
