import { ValueTransformer } from 'typeorm';

export class PriceTransformer implements ValueTransformer {
  to(value: number | null): number | null {
    if (value === null || value === undefined) {
      return value;
    }

    return Math.round(value * 100);
  }

  from(value: number | null): number | null {
    if (value === null || value === undefined) {
      return value;
    }

    return value / 100;
  }
}
