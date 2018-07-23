![npm package](https://badge.fury.io/js/create-web3-provider.svg)

# create-web3-provider
Create a web3 provider from scratch, with minimal to no configuration.

You can then pass the created provider directly into the Web3 constructor.

## Installation
```bash
npm install create-web3-provider
# or
yarn install create-web3-provider
```

## Example Usage
```js
const cw3p = require('create-web3-provider');
// Create an infura-backed provider on the mainnet.
let provider = cw3p();
// Create an infura-backed provider on the ropsten network.
provider = cw3p({network: 'ropsten'});
// Create an infura-backed provider using your own API key.
provider = cw3p({infuraKey: 'MySecretInfuraKey'});
// Create a provider connected to 'http://localhost:8545'
provider = cw3p({uri: 'http://localhost:8545'});
// Create a provider connected to a websocket.
provider = cw3p({uri: 'ws://mydomain.com/path'});
// Create a provider connected to an IPC path.
provider = cw3p({uri: '/path/to/provider.ipc', net: require('net')});

// Full options:
cw3p({
	// Network to connect to. May be 'main', ''mainnet', 'ropsten', or 'rinkeby'.
	network: String,
	// Infura API key, if using infura.
	infuraKey: String,
	// Connect to a custom provider. May be an http://, ws://, or IPC path.
	// IPC paths require the 'net' option as well.
	uri: String,
	// If using an IPC path, set this to `require('net')`
	net: Object
});
```
