const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

import { handler as createHandler } from './create';
import { handler as getHandler } from './get-one';
import { handler as getAllHandler } from './get-all';
import { handler as updateHandler } from './update';
import { handler as deleteHandler } from './delete';

exports.main = async (event: any = {}, context: any = {}): Promise<any> => {
  try {

    // Due to API Gateway Integrations, we trust event.path to be either:
    //   * /contacts/
    //   * /contacts/{itemID}
    const method = event.httpMethod;

    if (method === "GET") {
      // GET /contacts/ to get the names of all widgets
      if (event.path === "/contacts/" || event.path === "/contacts") {
        return getAllHandler();
      }

      // GET /contacts/ID/ to get an item of ID
      const itemID = event.path.substring(1);
      if (itemID) {
        return getHandler(event);
      }
    }

    if (method === "POST") {
      // POST /contacts/ to create a contact
      return createHandler(event);
    }

    if (method === "PUT") {
      // PUT /contacts/ to update a contact
      return updateHandler(event);
    }

    if (method === "DELETE") {
      // DELETE /contacts/ to delete a contact
      return deleteHandler(event);
    }

    // In case we got something besides a GET, POST, PUT, or DELETE
    // Should not be the case, since API Gateway is predefined
    return {
      statusCode: 400,
      headers: {},
      body: "We only accept GET, POST, PUT, and DELETE, not " + method
    };
  } catch (error) {
    const body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
      headers: {},
      body: body
    }
  }
};