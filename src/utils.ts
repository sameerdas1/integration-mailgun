import { ActionType } from './types';

export function verifyActionArgument(args: string[]): ActionType {
  const validActions = Object.values(ActionType);
  if (args.length !== 3) {
    throw new Error(
      'This module accepts a single argument: ts-node src/runIntegration.ts <action>, where <action> can be one of: ' +
        validActions.join(', '),
    );
  }
  const [, , action] = args;
  if (!validActions.includes(action as ActionType)) {
    throw new Error(
      'Action argument must be one of ' + validActions.join(', '),
    );
  }
  return action as ActionType;
}
