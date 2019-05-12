'use strict'
const _ = require('lodash');
const HttpProvider = require('web3-providers-http');
const IpcProvider = require('web3-providers-ipc');
const WebsocketProvider = require('web3-providers-ws');

function createProvider(opts={}) {
	opts = _.defaults({}, opts, { reconnect: true });
	const uri = opts.uri ||
		createProviderURI(opts.ws, opts.network, opts.infuraKey);
	const provider = new WrappedProvider(uri, opts);
	if (opts.reconnect && _.isNumber(opts.reconnect) && opts.reconnect > 0) {
		// Force regular reconnects.
		setInterval(() => provider.reconnect(), opts.reconnect);
	}
	return provider;
}

// Provider wrapper that automatically reconnects on error events.
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
	if (/^https?:\/\/.+$/.test(uri)) {
		return new HttpProvider(uri, opts);
	}
	if (/^wss?:\/\/.+$/.test(uri)) {
		return new WebsocketProvider(uri, opts);
	}
	if (!opts.net) {
		throw new Error(`IPC transport requires 'net' option.`);
	}
	return new IpcProvider(uri, opts.net);
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
