# NATS Communication

## Authentication

The bundled NATS Server Config is configured to ensure clients connected via the regular port are recognized as `server` and everyone connecting via WebSocket is recognized as `client`. By doing this, it is not necessary for anyone to configure tokens but also ensure access control.

## Authorization

### `server`

The user `server` is allowed to publish and subscribe to everywhere.

### `client`

The user `client` is allowed to publish to `vacdm-client.>` and subscribe to `vacdm.>`. It is not allowed to publish and subscribe to any other topics.

## Concept

All messages have to be valid JSON.

### Server -> Clients

All messages from the server to the clients are sent on the topic `vacdm.<icao>.<callsign>`

### Client -> Servers

All messages from the clients to the servers are sent on the topics `vacdm-client.<icao>.<callsign>`.

Meta-Messages are sent via `vacdm-client._.>`.

The messages are structured in the following way:

```json
{
  "token": "<plugin-token>",
  "message": {} // object of DPI
}
```

## Messages

### "Hello Server, I am here": `vacdm-client._.hello`

```json
{
  "callsign": "EDDS_STG_APP",
  "session": "<16 char random string>",
  "airports": [
    "EDDS",
    "EDSB",
    "EDTY",
    "EDTL"
  ]
}
```
