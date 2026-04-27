import { ValueTransformer } from 'typeorm';

export class ReviewAvgTransformer implements ValueTransformer {
  to(value: number): number {
    return value;
  }

  from(value: number): number {
    return Number(value);
  }
}
