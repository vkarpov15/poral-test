import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from '../activities';
import dedent from 'dedent';

const { getSponsors } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function testWorkflow(): Promise<string> {
  const sponsors = await getSponsors();

  const result = [];
  for (const sponsor of sponsors) {
    if (sponsor.tier !== 'sponsor' || !sponsor.isActive) {
      continue;
    }
    result.push(
      dedent(`
        <a rel="sponsored" href="${sponsor.website}">
          <img class="sponsor" src="${sponsor.image}" style="height:100px"/>
        </a>
      `)
    );
  }

  return result.join('\n');
};