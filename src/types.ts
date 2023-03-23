/**
 * The types necessary for this integration
 */

export type SeedInput = {
  identifier: string;
  mailingList: string;
  // other custom fields below, if necessary
};

export type AccessResponse = {
  // the personal data retrieved
  data: object;
  // the context necessary to perform an Erasure
  contextDict?: { [key in string]: any };
};

export type IntegrationDatapoints = {
  // the Seed function
  seed: (seedInput: SeedInput) => Promise<void>;
  // the Access datapoint
  access: (identifier: string) => Promise<AccessResponse>;
  // the Erasure datapoint
  erasure: (identifier: string, contextDict?: object) => Promise<void>;
};

export enum ActionType {
  Access = 'ACCESS',
  Erasure = 'ERASURE',
  Seed = 'SEED',
}
