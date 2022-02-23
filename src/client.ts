// @@@SNIPSTART typescript-hello-client
import { Connection, WorkflowClient } from '@temporalio/client';
import { generateSponsorsWorkflow } from './workflows';

async function run() {
  const connection = new Connection(); // Connect to localhost with default ConnectionOptions.

  const client = new WorkflowClient(connection.service);

  // Invoke the `example` Workflow, only resolved when the workflow completes
  const handle = await client.start(generateSponsorsWorkflow, {
    taskQueue: 'tutorial',
    workflowId: 'test' + Date.now(),
  });
  console.log(`Started workflow ${handle.workflowId}`);
  // optional: wait for client result
  console.log(await handle.result()); // Hello, Temporal!
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
// @@@SNIPEND
