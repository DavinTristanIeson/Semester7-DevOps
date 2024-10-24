import { Expose, Type } from "class-transformer";
import { BoundingBox, Point } from "../common/model";

// Model
export enum ExpressionRecognitionTaskStatus {
  NotStarted = "not_started",
  Pending = "pending",
  Failed = "failed",
  Success = "success",
}

export enum FacialExpression {
  Happy = "happy",
  Angry = "angry",
  Surprised = "surprised",
  Disgusted = "disgusted",
  Sad = "sad",
  Neutral = "neutral",
}

export class FacialExpressionProbabilities {
  happy: number
  angry: number
  surprised: number
  disgusted: number
  sad: number
  neutral: number

  static classify(probabilities: FacialExpressionProbabilities): FacialExpression {
    const values = [probabilities.happy, probabilities.angry, probabilities.surprised, probabilities.disgusted, probabilities.sad, probabilities.neutral];
    const labels = [FacialExpression.Happy, FacialExpression.Angry, FacialExpression.Surprised, FacialExpression.Disgusted, FacialExpression.Sad, FacialExpression.Neutral]
    let maxIdx = 0;
    let maxValue = 0
    for (let i = 0; i < values.length; i++){
      if (maxValue < values[i]){
        maxValue = values[i];
        maxIdx = i;
      }
    }
    return labels[maxIdx];
  }
}

export class ExpressionRecognitionTaskResultModel {
  filename: string;

  @Type(() => BoundingBox)
  bbox: BoundingBox;

  @Expose({name: "representative_point"})
  @Type(() => Point)
  representativePoint: Point;

  @Type(() => FacialExpressionProbabilities)
  probabilities: FacialExpressionProbabilities;
}

export class ExpressionRecognitionTaskModel {
  id: string;
  status: ExpressionRecognitionTaskStatus;
  results: ExpressionRecognitionTaskResultModel[] | null;
  error: string | null;
}


// Input
export interface CreateTaskInput {
  file: File;
}