'use strict'
const _ = require('lodash');
const WebsocketProvider = require('web3-providers-ws');
const HttpProvider = require('web3-providers-http');
const IpcProvider = require('web3-providers-ipc');

function createProvider(opts={}) {
	opts = _.defaults({}, opts, {
			reconnect: true
		});
	const uri = opts.uri ||
		createProviderURI(opts.ws, opts.network, opts.infuraKey);
	const provider = new WrappedProvider(uri, opts);
	if (opts.reconnect && _.isNumber(opts.reconnect) && opts.reconnect > 0) {
		// Force regular reconnects.
		setInterval(() => provider.reconnect(), opts.reconnect);
	}
	return provider;
}

class WrappedProvider {
	constructor(uri, opts={}) {
		this._opts = opts;
		this.uri = uri;
		this.reconnect();
	}

	reconnect() {
		if (this.provider && this.provider.connection) {
			const connection = this.provider.connection;
			this.provider = null;
			connection.close();
		}
		this.provider = _createProvider(this.uri, this._opts);
		_.extend(this, this.provider);
		if (this._opts.reconnect) {
			if (_.isFunction(this.provider.on)) {
				const handler = () => {
					if (this.provider)
						this.reconnect();
				};
				this.provider.on('error', handler)
				this.provider.on('end', handler)
				this.provider.on('close', handler);
			}
		}
	}
}

function _createProvider(uri, opts={}) {
	if (/^https?:\/\/.+$/.test(uri))
		return new HttpProvider(uri, opts);
	if (/^wss?:\/\/.+$/.test(uri))
		return new WebsocketProvider(uri, opts);
	if (!opts.net)
		throw new Error(`IPC transport requires 'net' option.`);
	return new IpcProvider(uri, opts.net);
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
