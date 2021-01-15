const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.CONTACT_TABLE_NAME || '';

export const handler = async (): Promise<any> => {

  const params = {
    TableName: TABLE_NAME
  };

  try {
    const response = await db.scan(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (dbError) {
    console.error(dbError);
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
