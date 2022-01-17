import irisDataJson from './iris.json';

export type IrisDatum = {
  sepalLength: number;
  sepalWidth: number;
  petalLength: number;
  petalWidth: number;
  species: 'setosa' | 'versicolor' | 'virginica';
};

export const irisData = irisDataJson as IrisDatum[];
