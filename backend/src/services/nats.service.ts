import * as nats from 'nats';
import config from '../config';
import Logger from '@dotfionn/logger';

let natsConnection: nats.NatsConnection;
const stringCodec = nats.StringCodec();

const logger = new Logger('vACDM:services:nats');

interface PublishParams {
  topic: string;

  payload?: object;
}

interface SubscribeParams {
  topic: string;

  callback: (message: nats.Msg) => unknown;
}

async function connect(): Promise<nats.NatsConnection> {
  logger.info('creating new connection to nats');

  natsConnection = await nats.connect({ servers: config().natsHosts });

  return natsConnection;
}

async function getConnection(): Promise<nats.NatsConnection> {
  if (
    natsConnection &&
    !natsConnection.isClosed() &&
    !natsConnection.isDraining()
  ) {
    return natsConnection;
  }

  return await connect();
}

function getTopic(topic: string): string {
  return [config().natsPrefix, 'vacdm', topic].map(str => str.trim()).filter(Boolean).join('.')
}

function encode(payload: object | undefined): Uint8Array {
  if (!payload) {
    return nats.Empty;
  }

  return stringCodec.encode(JSON.stringify(payload));
}

function decode(payload: Uint8Array): object {
  return JSON.parse(stringCodec.decode(payload));
}

async function publish(params: PublishParams) {
  const client = await getConnection();

  client.publish(params.topic, encode(params.payload))
}

async function subscribe(params: SubscribeParams) {
  const client = await getConnection();

  const subscription = client.subscribe(params.topic);

  (async () => {
    for await (const message of subscription) {
      params.callback(message);
    }
  })();
};

async function request() {}

export default {
  getConnection,
  subscribe,
  publish,
};
