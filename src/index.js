'use strict'
const _ = require('lodash');
const Web3 = require('web3');

function createProvider(opts={}) {
	const uri = opts.uri || createProviderURI(opts.ws, opts.network, opts.infuraKey);
	if (/^https?:\/\/.+$/.test(uri))
		return new Web3.providers.HttpProvider(uri);
	if (/^wss?:\/\/.+$/.test(uri))
		return new Web3.providers.WebsocketProvider(uri);
	if (!opts.net)
		throw new Error(`IPC transport requires 'net' option.`);
	return new Web3.providers.IpcProvider(uri, opts.net);
}

function createProviderURI(websocket, network, infuraKey) {
	network = network || 'main';
	infuraKey = infuraKey || createInfuraKey();
	if (network == 'main')
		network = 'mainnet';
	if (websocket)
		return `wss://${network}.infura.io/ws/${infuraKey}`;
	return `https://${network}.infura.io/${infuraKey}`;
}

function createInfuraKey() {
	const symbols =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	return _.times(20, () => symbols[_.random(0, symbols.length-1)]).join('');
}

module.exports = createProvider;
