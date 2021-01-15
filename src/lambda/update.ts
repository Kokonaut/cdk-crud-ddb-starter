const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.CONTACT_TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

export const handler = async (event: any = {}): Promise<any> => {

  const requestedItemId = event.pathParameters.id;
  if (!requestedItemId) {
    return { statusCode: 400, body: `Error: You are missing the path parameter id` };
  }

  const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);

  let _updateExpression = 'set ';
  let _valuesMap = new Map<String, any>();
  let i = 0;

  for (let [k, v] of Object.entries(item)) {
    let valueVar = `:v${i}`;
    _updateExpression += `${k} = ${valueVar}`;
    _valuesMap.set(valueVar, v);
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      [PRIMARY_KEY]: requestedItemId
    },
    UpdateExpression: _updateExpression,
    ExpressionAttributeValues: _valuesMap
  };

  try {
    const response = await db.update(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Item) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
