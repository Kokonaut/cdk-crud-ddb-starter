import { DataMapper } from "@aws/dynamodb-data-mapper";
import DynamoDB = require("aws-sdk/clients/dynamodb");
import ContactDDBItem from "../db/contact-ddb-item";


export const handler = async (event: any = {}): Promise<any> => {

  const requestedItemId = event.pathParameters.id;
  if (!requestedItemId) {
    return { statusCode: 400, body: `Error: You are missing the path parameter id` };
  }

  const mapper = new DataMapper({
    client: new DynamoDB()
  });

  try {
    const response = await mapper.get(new ContactDDBItem().setPrimaryKey(requestedItemId));
    if (!response) {
      return { statusCode: 404 }
    }
    return { statusCode: 200, body: JSON.stringify(response) };
  } catch (dbError) {
    console.error(dbError);
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
