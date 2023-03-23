// imports
import nock from './nock_import';
import { mailgunDataPoints as datapoints } from './mailgunDatapoints';
import { ActionType, IntegrationDatapoints, SeedInput } from './types';
import { verifyActionArgument } from "./utils";
import { TEST_DATA } from './constants';
// import { ACCESS }
//new imports
import axios from 'axios';
import test from 'ava';


/**
 * Runs Access and/or Erasure on the integration defined by dataPoints
 *
 * @param identifier - the identifier of the user who would like to Access or erase their data
 * @param dataPoints - the configuration of the integration
 * @param actionType - The action to run.
 */
async function runIntegration(
  identifier: string,
  dataPoints: IntegrationDatapoints,
  actionType: ActionType.Access | ActionType.Erasure,
): Promise<void> {
  const { access, erasure } = dataPoints;
  console.log('Running Access...');
  const { data, contextDict } = await access(identifier);
  console.log(`Data retrieved for ${identifier}: `);
  console.log(JSON.stringify(data, null, 2));

  if (actionType === ActionType.Access) {
    return;
  }

  console.log(`Context dictionary for the erasure: `);
  console.log(JSON.stringify(contextDict, null, 2));
  console.log('Running Erasure...');
  await erasure(identifier, contextDict);
  console.log('All done!');
}

/**
 * Seed data into Mailgun.
 *
 * @param seedInput
 * @param dataPoints
 */
async function seedIntegration(
  seedInput: SeedInput[],
  dataPoints: IntegrationDatapoints,
): Promise<void> {
  const { seed } = dataPoints;
  console.log('Seeding data...');
  await Promise.all(
    seedInput.map(async (seedEntry) => await seed(seedEntry))
  );
  console.log(`Successfully seeded ${seedInput.length} identifiers.`);
}


// nock and axios interceptor compatability attempt
// axios.defaults.adapter = require('axios/lib/adapters/http')



// Main function.
(async () => {
  const action = verifyActionArgument(process.argv);
  const mockFile = `${action}.json`

  const nockDefs = nock.loadDefs(mockFile)
  nockDefs.forEach(def => {
    //  Do something with the definition object e.g. scope filtering.
    def.options = {
      ...def.options,
      filteringScope: scope => /^https:\/\/api\.mailgun\.net/.test(scope),
    }

    // console.log("Checkpoint 1")

  })

  //  Load the nocks from pre-processed definitions.
  nock.define(nockDefs)

  // For now, we only want to run our application code
  // with the first identifier.
  // Once you're confident your code works, you can modify
  // this to refer to the entire list of identifiers!
  if (action === ActionType.Seed) {
    // Transform the data to be used as seed input.
    await seedIntegration([TEST_DATA], datapoints);
  }

  if (action === ActionType.Access || action === ActionType.Erasure) {
    await runIntegration(TEST_DATA.identifier, datapoints, action);
  }

})();
