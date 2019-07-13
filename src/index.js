'use strict'
const _ = require('lodash');
const providers = require('../vendor/dist/web3-providers');

function createProvider(opts={}) {
	opts = _.defaults({}, opts);
	const uri = opts.uri ||
		createProviderURI(opts.ws, opts.network, opts.infuraKey);
	return _createProvider(uri, opts);
}

function _createProvider(uri, opts={}) {
	if (/^https?:\/\/.+$/.test(uri)) {
		return new providers.HttpProvider(uri, opts);
	}
	if (/^wss?:\/\/.+$/.test(uri)) {
		return new providers.WebsocketProvider(uri, opts);
	}
	if (!opts.net) {
		throw new Error(`IPC transport requires 'net' option.`);
	}
	return new providers.IpcProvider(uri, opts.net);
}

function createProviderURI(websocket, network, infuraKey) {
	network = network || 'main';
	infuraKey = infuraKey || 'b9618835284c4f5984bf6fe7332c2b2e';
	if (network == 'main') {
		network = 'mainnet';
	}
	if (websocket) {
		return `wss://${network}.infura.io/ws/v3/${infuraKey}`;
	}
	return `https://${network}.infura.io/v3/${infuraKey}`;
}

module.exports = createProvider;
module.exports.providers = providers;
