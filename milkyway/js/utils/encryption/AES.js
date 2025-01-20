function arrayBufferToBase64(buffer) {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
	const binaryString = window.atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
}

const AES = {
	peoplesKey: {},
	myKey: {
		key: null, expiresAt: 0,
	},
	generateKey: async function() {
		console.log('[AES] generated new key');
		const newKey = await crypto.subtle.generateKey({
				name: "AES-GCM",
				length: 256,
			},
			true,
			["encrypt", "decrypt"]
		);
		this.myKey = {
			key: newKey,
			expiresAt: new Date(Date.now() + (HYPERPARAMETER.aesExpiresAt)),
		};
		SETTINGS.AES = {
			key: await this.exportKey(newKey),
			expiresAt: this.myKey.expiresAt,
		}
	},
	
	setKeyWithUsername: async function(username, key){
		const updated = SETTINGS.aesKeys;
		updated[username] = key;
		SETTINGS.aesKeys = updated;
		this.peoplesKey[username] = await this.importKey(key);
	},
	getKeyWithUsername: async function(username){
		if(this.peoplesKey[username]){
			return this.peoplesKey[username];
		}
		if(SETTINGS.aesKeys[username]){
			return this.peoplesKey[username] = await this.importKey(SETTINGS.aesKeys[username]);
		}
		await makeHandshakeWIth(username);
		return this.peoplesKey[username];
	},
	hasKeyOfUser: function(username){
		return this.peoplesKey[username] || SETTINGS.aesKeys[username];
	},

	getKey: async function() {
		if(this.myKey.key &&  TIME.now() < this.myKey.expiresAt){
			return this.myKey.key;
		}
		if (SETTINGS.AES !== null && TIME.now() < SETTINGS.AES.expiresAt) {
			this.myKey = {
				key: this.importKey(SETTINGS.AES.key),
				expiresAt: SETTINGS.expiresAt,
			};
			return this.myKey.key;
		}
		if (SETTINGS.AES === null || TIME.now() >= SETTINGS.AES.expiresAt) {
			await this.generateKey();
		}
		this.myKey = {
			key: this.importKey(SETTINGS.AES.key),
			expiresAt: SETTINGS.expiresAt,
		};
		return this.myKey.key;
	},

	encrypt: async function(data) {
		const key = await this.getKey();
		const encoder = new TextEncoder();
		const encodedData = encoder.encode(data);
		const iv = crypto.getRandomValues(new Uint8Array(12));
		const encryptedData = await crypto.subtle.encrypt({
				name: "AES-GCM",
				iv: iv,
			},
			key,
			encodedData
		);
		const ivBase64 = arrayBufferToBase64(iv);
		const encryptedBase64 = arrayBufferToBase64(encryptedData);

		return `${ivBase64}:${encryptedBase64}`;
	},
	decrypt: async function(key, encryptedString) {
		const [ivBase64, encryptedBase64] = encryptedString.split(':');
		const iv = base64ToArrayBuffer(ivBase64);
		const encryptedData = base64ToArrayBuffer(encryptedBase64);

		const decryptedData = await crypto.subtle.decrypt({
				name: "AES-GCM",
				iv: new Uint8Array(iv),
			},
			key,
			new Uint8Array(encryptedData)
		);

		const decoder = new TextDecoder();
		return decoder.decode(decryptedData);
	},
	exportKey: async function(key) {
		const exportedKey = await crypto.subtle.exportKey(
			'jwk',
			key
		);
		return JSON.stringify(exportedKey);
	},
	importKey: async function(jwk) {
		const keyData = JSON.parse(jwk);
		const key = await crypto.subtle.importKey(
			'jwk',
			keyData, {
				name: "AES-GCM",
				length: 256,
			},
			true,
			["encrypt", "decrypt"]
		);
		return key;
	}
};