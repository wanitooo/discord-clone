import { NestDrizzleOptions } from './';
import { NEST_DRIZZLE_OPTIONS } from './constants';

export function createNestDrizzleProviders(options: NestDrizzleOptions) {
  return [
    {
      provide: NEST_DRIZZLE_OPTIONS,
      useValue: options,
    },
  ];
}
