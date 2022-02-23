import { Connection, WorkflowClient } from '@temporalio/client';
import { Worker, Core, DefaultLogger } from '@temporalio/worker';
import * as activities from '../activities';
import { afterEach, describe, it } from 'mocha';
import assert from 'assert';
import axios from 'axios';
import dedent from 'dedent';
import { testWorkflow } from '../workflows';
import sinon from 'sinon';

describe('generateSponsorsWorkflow', function() {
  let runPromise: Promise<any>;
  let worker: Worker;
  let workflow: any;
  let client: WorkflowClient;

  before(async function() {
    this.timeout(10000);

    const logger = new DefaultLogger('ERROR');
    await Core.install({
      logger
    });

    worker = await Worker.create({
      workflowsPath: require.resolve('../workflows'),
      activities,
      taskQueue: 'testsponsors'
    });

    runPromise = worker.run();
  });

  beforeEach(async function() {
    const connection = new Connection();
    client = new WorkflowClient(connection.service);
  });

  after(async function() {
    worker.shutdown();
    await runPromise;
  });

  afterEach(() => sinon.restore());

  it('gets the correct sponsors', async function() {
    this.timeout(10000);

    sinon.stub(axios, 'get').callsFake(() => Promise.resolve(testApiResponse));

    workflow = await client.start(testWorkflow, {
      workflowId: 'wf-' + Date.now(),
      taskQueue: 'testsponsors'
    });

    const res = await workflow.result();
    assert.equal(res, dedent(`
      <a rel="sponsored" href="https://localizejs.com">
        <img class="sponsor" src="https://opencollective-production.s3.us-west-1.amazonaws.com/bf92e080-26a7-11eb-9bd1-97e665135c29.png" style="height:100px"/>
      </a>
    `));
  });

  const testApiResponse = {
    data: [
      {
        "MemberId": 11423,
        "createdAt": "2018-01-13 00:17",
        "type": "USER",
        "role": "ADMIN",
        "isActive": true,
        "totalAmountDonated": 0,
        "currency": "USD",
        "lastTransactionAt": "2021-07-08 23:07",
        "lastTransactionAmount": -1863,
        "profile": "https://opencollective.com/code_barbarian",
        "name": "Valeri Karpov",
        "company": null,
        "description": "I write Node and write about Node",
        "image": "https://avatars.githubusercontent.com/vkarpov15",
        "email": null,
        "twitter": "https://twitter.com/code_barbarian",
        "github": "https://github.com/vkarpov15",
        "website": "https://thecodebarbarian.com"
      },
      {
        "MemberId": 11424,
        "createdAt": "2018-01-13 00:17",
        "type": "ORGANIZATION",
        "role": "HOST",
        "isActive": true,
        "totalAmountDonated": 37.15,
        "currency": "USD",
        "lastTransactionAt": "2021-10-18 15:27",
        "lastTransactionAmount": -25,
        "profile": "https://opencollective.com/opensource",
        "name": "Open Source Collective",
        "company": null,
        "description": "Non-profit fiscal host promoting a healthy and sustainable open source ecosystem.",
        "image": "https://opencollective-production.s3.us-west-1.amazonaws.com/97017710-a90f-11e9-b6fb-2bbe7128f780.png",
        "email": null,
        "twitter": "https://twitter.com/opencollect",
        "github": null,
        "website": "https://oscollective.org"
      },
      {
        "MemberId": 11551,
        "createdAt": "2018-01-16 19:54",
        "type": "ORGANIZATION",
        "role": "BACKER",
        "tier": "sponsor",
        "isActive": false,
        "totalAmountDonated": 1700,
        "currency": "USD",
        "lastTransactionAt": "2019-05-02 05:02",
        "lastTransactionAmount": 100,
        "profile": "https://opencollective.com/mixmax",
        "name": "Mixmax",
        "company": null,
        "description": "The future of professional communication",
        "image": "https://opencollective-production.s3-us-west-1.amazonaws.com/fcf6c0d0-f730-11e7-af8c-05ca2e1ddbda.png",
        "email": null,
        "twitter": "https://twitter.com/Mixmax",
        "github": "https://github.com/mixmaxhq",
        "website": "https://mixmax.com"
      },
      {
        "MemberId": 13137,
        "createdAt": "2018-02-24 20:47",
        "type": "ORGANIZATION",
        "role": "BACKER",
        "tier": "backer",
        "isActive": false,
        "totalAmountDonated": 8,
        "currency": "USD",
        "lastTransactionAt": "2018-05-01 05:08",
        "lastTransactionAmount": 2,
        "profile": "https://opencollective.com/usehenri1",
        "name": "henri js framework",
        "company": null,
        "description": null,
        "image": "https://opencollective-production.s3-us-west-1.amazonaws.com/308498c0-19a3-11e8-8343-278614155b3e.png",
        "email": null,
        "twitter": "https://twitter.com/usehenri",
        "github": null,
        "website": "https://usehenri.io"
      },
      {
        "MemberId": 13281,
        "createdAt": "2018-02-27 22:57",
        "type": "ORGANIZATION",
        "role": "BACKER",
        "tier": "sponsor",
        "isActive": true,
        "totalAmountDonated": 1100,
        "currency": "USD",
        "lastTransactionAt": "2018-12-01 05:15",
        "lastTransactionAmount": 100,
        "profile": "https://opencollective.com/localizecorp",
        "name": "Localize Corporation",
        "company": null,
        "description": null,
        "image": "https://opencollective-production.s3.us-west-1.amazonaws.com/bf92e080-26a7-11eb-9bd1-97e665135c29.png",
        "email": null,
        "twitter": "https://twitter.com/Localize",
        "github": "https://github.com/localize",
        "website": "https://localizejs.com"
      }
    ]
  };
});