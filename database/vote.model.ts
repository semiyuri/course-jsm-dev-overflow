import { model, models, Schema, Types } from "mongoose";

import { VoteType, VoteVoteType } from "@/types/model";

export interface IVote {
  author: Types.ObjectId;
  id: Types.ObjectId;
  type: VoteType;
  voteType: VoteVoteType;
}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: {
      type: String,
      enum: [VoteType.Question, VoteType.Answer],
      required: true,
    },
    voteType: {
      type: String,
      enum: [VoteVoteType.UpVote, VoteVoteType.DownVote],
      required: true,
    },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
