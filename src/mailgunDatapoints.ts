// external
import axios from 'axios';
import nock from 'nock';
import { TEST_DATA } from './constants';
import access_response from '../ACCESS.json';

// types
import { AccessResponse, IntegrationDatapoints, SeedInput } from './types';

// const https = require('https');
const MAILGUN_API_KEY = 'd95f6140b8b7f43079880c5e0b525040-b36d2969-1b3706ff';
const MAILGUN_BASE_URL = 'https://api.mailgun.net/v3';

export const mailgunDataPoints: IntegrationDatapoints = {
  /**
   * Create mailing lists and Seed user(s) onto them
   */
  seed: async (seedInput: SeedInput): Promise<void> => {
    throw new Error('Seeding not implemented!');
  },
  
  /**
   * Get all mailing lists that the user belongs to
   */
  access: async (identifier: string): Promise<AccessResponse> => {
    const url = `${MAILGUN_BASE_URL}/lists`;

    try {
      //mock the API response with nock for testing purposes
      // this nock requirestatement doesn't comply with TS module syntax without causing a bug (only remaining ESLint issue)
      const nock = require('nock');
      const scope = nock('https://api.mailgun.net', {
        auth: {
          username: 'api',
          password: '${MAILGUN_API_KEY}',
        },
      })
        .get('/v3/lists')
        .reply(200, access_response)

      // axios: actual Mailgun API call
      const response = await axios.get(url, {
        auth: {
          username: 'api',
          password: '${MAILGUN_API_KEY}',
        },
      });


      const mailingList = filterMailingLists(identifier, response);

      // nock test logging
      // console.log(`\nData retrieved for ${identifier}: \n[`);
      // console.log(mailingList + "\n]\n");

      //unspecified any for `response` allows function for flexibility but leads to type specification warning
      

      return {
        data: mailingList,
        contextDict: undefined,
      };
  }
    // error handling
    catch {
      throw new Error('Error acccessing mailing lists!');
    }
  },
  
  /**
   * Remove the user from all mailing lists.
   * NOTE: Erasure runs an Access (access()) before it to
   * fetch the context data it might need.
   */
  erasure: async (identifier: string, contextDict?: object): Promise<void> => {
    throw new Error('Erasure not implemented!');
  },
};

function filterMailingLists(identifier: string, response: any): string[] {
  const mailingLists: string[] = [];
  for (const data of response.data) {
    if (data.status !== 200) {
      continue;
    }
    for (const item of data.response.items) {
      if (item.address === identifier) {
        let pathStr = data.path.replace('/v3/lists/', '');
        pathStr = pathStr.replace('/members/pages', '');
        mailingLists.push(pathStr);
        return mailingLists;
      }
    }
  }
  return mailingLists;
}
