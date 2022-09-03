import { EntityBucket } from '@/api/stateofjs/generated';

export type Statistic = keyof Pick<EntityBucket, 'percentage_survey' | 'percentage_question' | 'count'>;

export interface TooltipDatum {
  datum: EntityBucket;
  isoCode: string;
  name: string;
}
