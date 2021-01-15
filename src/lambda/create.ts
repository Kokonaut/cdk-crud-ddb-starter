import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB = require('aws-sdk/clients/dynamodb');
import { v4 as uuidv4 } from 'uuid';
import ContactDDBItem from '../db/contact-ddb-item';

const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
  DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

export const handler = async (event: any = {}): Promise<any> => {

  if (!event.body) {
    return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
  }
  const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);

  item[PRIMARY_KEY] = uuidv4();

  const mapper = new DataMapper({
    client: new DynamoDB()
  })

  const toSave = Object.assign(new ContactDDBItem, {
    name: item.name,
    email: item.email,
    subject: item.subject,
    message: item.message,
    createdAt: new Date().toDateString()
  });

  try {
    await mapper.put(toSave);
    return { statusCode: 201, body: '' };
  } catch (dbError) {
    console.error(dbError);
    const errorResponse = dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword') ?
      DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
    return { statusCode: 500, body: errorResponse };
  }
};
