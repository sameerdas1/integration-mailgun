// external
// request-promise library deprecated, but functionality mostly covered by `got` library
import axios from 'axios';
import { access } from 'fs';
import got from 'got';
// import httpAdapter from 'axios/lib/adapters/http';
import nock from 'nock';
import { TEST_DATA } from './constants';
import access_response from '../ACCESS.json';

// types
import { AccessResponse, IntegrationDatapoints, SeedInput } from './types';

const https = require('https');

//improve variables names for readability
//

function filterList(identifier, response) {
  var mailingList: Array<string> = []; 
  for(let i=0; i<response.data.length; i++){
    if (response.data[i].status == 200){
      for(let j=0; j<response.data[i].response.items.length; j++){
        if(response.data[i].response.items[j].address == identifier){
          var pathStr = response.data[i].path;
          pathStr = pathStr.replace("/v3/lists/", "");
          pathStr = pathStr.replace("/members/pages", "");
          mailingList.push(pathStr);
          return mailingList;
        }
      }
      continue;
    }
  }
  return mailingList;
}

// The API key, from my account
export const MAILGUN_API_KEY =
  'd95f6140b8b7f43079880c5e0b525040-b36d2969-1b3706ff';

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
    const url = `https://api.mailgun.net/v3/lists`;
    // console.log('Checkpoint 2');

    //nock: mocked API call
    const nock = require('nock');
    const scope = nock('https://api.mailgun.net', {
      auth: {
        username: 'api',
        password: 'd95f6140b8b7f43079880c5e0b525040-b36d2969-1b3706ff',
      },
    })
      .get('/v3/lists')
      .reply(200, access_response)

    // axios: actual Mailgun API call
    const response = await axios.get(url, {
      auth: {
        username: 'api',
        password: 'd95f6140b8b7f43079880c5e0b525040-b36d2969-1b3706ff',
      },
    });

    // console.log('REQUEST');
    // console.log(response);

    // const mailingList = response.data[0].response.items;

    
    
    // console.log(mailingList)
    // const listID = Object.keys(mailingList).map((list: any) => list.address);
    // // console.log(listID)
    // const accessList = listID.filter((listID) => {
    //   return listID && listID.includes(identifier);
    // });

    var mailingList = filterList(identifier, response);

    // use for testing nock
    // console.log(`\nData retrieved for ${identifier}: \n`);
    // console.log(mailingList + "\n\n");

    // console.log(mailingList);

    return {
      data: mailingList,
      contextDict: undefined,
    };

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
