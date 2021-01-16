import { DataMapper } from "@aws/dynamodb-data-mapper";
import DynamoDB = require("aws-sdk/clients/dynamodb");
import ContactDDBItem from "../db/contact-ddb-item";


export const handler = async (): Promise<any> => {

  const mapper = new DataMapper({
    client: new DynamoDB()
  });

  try {
    // You would probably want some sort of pagination here, but I also
    // highly recommend never performing a scan on DDB
    let resultSet: ContactDDBItem[] = [];
    for await (const item of mapper.scan(ContactDDBItem)) {
      resultSet.push(item);
    }
    return { statusCode: 200, body: JSON.stringify(resultSet) };
  } catch (dbError) {
    console.error(dbError);
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
