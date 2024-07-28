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
	peoplesKey: new Map(),
	generateKey: async function() {
		console.log('[AES] generated new key');
		const newKey = await crypto.subtle.generateKey({
				name: "AES-GCM",
				length: 256,
			},
			true,
			["encrypt", "decrypt"]
		);
		SETTINGS.AES = {
			key: await this.exportKey(newKey),
			expiresAt: new Date(Date.now() + (HYPERPARAMETER.aesExpiresAt)),
		};
	},
	getKey: async function() {
		if (SETTINGS.AES === null || TIME.now() >= SETTINGS.AES.expiresAt) {
			await this.generateKey();
		}
		try {
			var key = await this.importKey(SETTINGS.AES.key);
		} catch (error) {
			console.error(error);
			await this.generateKey();
			key = await this.importKey(SETTINGS.AES.key);
		}
		return key;
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