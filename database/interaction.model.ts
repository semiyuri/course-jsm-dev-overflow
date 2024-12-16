import { model, models, Schema, Types } from "mongoose";

import { ActionType } from "@/types/model";

export interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: ActionType;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: {
      type: String,
      enum: [ActionType.Question, ActionType.Answer],
      required: true,
    },
  },
  { timestamps: true }
);

const Interaction =
  models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
