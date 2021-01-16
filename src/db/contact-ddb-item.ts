import {
  attribute,
  autoGeneratedHashKey,
  table,
  versionAttribute
} from '@aws/dynamodb-data-mapper-annotations';
import { AttributeValue } from 'aws-sdk/clients/dynamodb';
import { CustomType } from '@aws/dynamodb-data-marshaller';

const TABLE_NAME = "cdk-starter-contacts-table";
const KEY_NAME = "itemID";

const dateType: CustomType<Date> = {
  type: 'Custom',
  marshall: (input: Date): AttributeValue => ({ S: input.toISOString() }),
  unmarshall: (persistedValue: AttributeValue): Date => new Date(persistedValue.S!)
}

@table(TABLE_NAME)
export default class ContactDDBItem {
  public static TABLE_NAME = TABLE_NAME;
  public static PARTITION_KEY_NAME = KEY_NAME;

  // Used for query mapper objects
  public setPrimaryKey(primaryKey: string): ContactDDBItem {
    this.itemID = primaryKey;
    return this;
  }

  @autoGeneratedHashKey()
  itemID: string;

  @versionAttribute()
  version: number;

  @attribute({ memberType: dateType, defaultProvider: () => new Date() })
  createdAt: Date;

  @attribute()
  name: string;

  @attribute()
  email: string;

  @attribute()
  subject: string;

  @attribute()
  message: string;
}