const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

import { handler as createHandler } from './create';
import { handler as getHandler } from './get-one';
import { handler as getAllHandler } from './get-all';
import { handler as updateHandler } from './update';
import { handler as deleteHandler } from './delete';

exports.main = async (event: any = {}, context: any = {}): Promise<any> => {
  try {
    console.log("DEV");
    console.log(event.body);

    var method = event.httpMethod;

    // Get itemID, if present
    var itemID = event.path.startsWith('/') ? event.path.substring(1) : event.path;

    if (method === "GET") {
      // GET / to get the names of all widgets
      if (event.path === "/") {
        return getAllHandler();
      }

      // GET /ID to get an item of ID
      if (itemID) {
        return getHandler(event);
      }
    }

    if (method === "POST") {
      return createHandler(event);
    }

    if (method === "PUT") {
      return updateHandler(event);
    }

    if (method === "DELETE") {
      return deleteHandler(event);
    }

    // We got something besides a GET, POST, or DELETE
    return {
      statusCode: 400,
      headers: {},
      body: "We only accept GET, POST, and DELETE, not " + method
    };
  } catch (error) {
    var body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
      headers: {},
      body: body
    }
  }
};