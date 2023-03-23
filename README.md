# integrations-challenge

This tech challenge is designed to test some basic web development practices. You will be building a program that interacts with a mocked Mailgun API.

## To run

- Ensure you have [Node.js](https://nodejs.org/en/) and a package manager installed like [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- Run `npm install` or `yarn` from root
- From the root of the repository, you can run any of the following three commands to perform the following actions:
  - Access: `npm run access`
  - Erasure: `npm run erasure`
  - Seed: `npm run seed`

## Candidate Instructions

- Completing this practical challenge is very similar to what work would be like as an Integrations Engineer with Transcend.
  In this challenge you will be implementing a mock integration with Mailgun, an integration Transcend already offers.
- IMPORTANT: For the purposes of this challenge, we expect you to implement _ONLY_ an Access request, with the Erasure and Seeding logic as _optional_, bonus challenges.
- Please do not use a Mailgun API wrapper/SDK; instead, we expect you to use the HTTP API.
- You can use the request library of your choice! In this challenge, you'll find that we provide [`request-promise`](https://www.npmjs.com/package/request-promise),
  [`axios`](https://www.npmjs.com/package/axios), and [`got`](https://www.npmjs.com/package/got), but you can use the library of your choice!
- You may see an error when making a request to an un-mocked endpoint: `RequestError: Nock: No match for request`. This is because the real Mailgun API has lots of documented endpoints and parameters that we did not mock, and your solution may be valid though it may not be what we expected. In this case, please go ahead and submit your implementation, and make sure to leave ample comments, potentially linking to API docs that you referenced.

### To implement:

You'll have to research the [Mailgun API](https://documentation.mailgun.com/en/latest/api_reference.html) and understand how to use it to look up mailing lists a person is subscribed to, and to remove them from said list(s)! Pro-tip: `/v3/lists` is where you can fetch the list of Mailgun mailing lists associated with your account, with `/v3/lists/pages` being the paginated version of the same endpoint.

- Access: Given an email address as an identifier in the `src/mailgunDatapoints.ts` file, return a list of email lists the person is in. Running `npm run access` should give you the following results:

```
Data retrieved for spongebob@transcend.io:
[
  "barnacle_club@sandbox7743ee8a12e6444883a136ec1e3b41f2.mailgun.org"
]
```

- Erasure: Given an identifier and context, remove that person from Mailgun mailing lists. Running `npm run erasure` should give you the following results. Warning: the `Context dictionary` in the output logs may look different depending on your implementation! What's more important is that you are passing the correct information along and the code finishes running:

```
Data retrieved for spongebob@transcend.io:
[
  "barnacle_club@sandbox7743ee8a12e6444883a136ec1e3b41f2.mailgun.org"
]
Context dictionary for the erasure:
{
  mailingLists: ["barnacle_club@sandbox7743ee8a12e6444883a136ec1e3b41f2.mailgun.org"]
}
Running Erasure...
All done!
```

- Seed: Given an identifier as a seed input, add them to the Mailgun organisation. Running `npm run seed` should give you the following results:

```
Seeding data...
Successfully seeded 1 identifiers.
```

### Evaluation Criteria

We will evaluate your solution using the following rubric:
| Criteria | Below Expectations | Meets Expectation | Exceeds Expectations |
| ----------- | ----------- | ----------- | ----------- |
| Completeness | Basic functionality does not work, and/or has many bugs. | Implements the basic functionality without bugs. | Implements the basic functionality and at least one of the bonus challenges. |
| Readability & Maintainability | Inconsistent syntax (ie did not use a linter). Poor function/variable names. | Used a linter. Easy to understand function/variable names. | Follows best practices for writing React components. Modularized code. Leaves comments explaining non-obvious trade-offs/future breakage. |
| Robustness | Has no error handling, logging, etc. | Has some error handling and logging (or at least comments about TODOs). | All code paths have some error handling. Care has been taken to log errors and information that would help with future debugging. |
