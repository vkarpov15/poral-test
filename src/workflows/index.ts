import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from '../activities';

const { makeHTTPRequest } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function testWorkflow(): Promise<string> {
  return await makeHTTPRequest();
};