import bplistParser from './bplistParser.js';
import crypto from "crypto-js";
require("buffer/");

function AesDecrypt(msg, key, ivBase64) {
	let aesDecryptor = crypto.algo.AES.createDecryptor(crypto.enc.Utf8.parse(key), { iv: crypto.enc.Base64.parse(ivBase64) });

	let one = aesDecryptor.process(crypto.enc.Base64.parse(msg));
	let two = aesDecryptor.finalize();

	let text = crypto.enc.Utf8.stringify(one) + crypto.enc.Utf8.stringify(two);

	return JSON.parse(text);
}

export function parse(data) {
	let obj = bplistParser.parseBuffer(Buffer.from(data));

	let result = AesDecrypt(obj[0]["0 data"], "K1FjcmVkc2Vhc29u", "LH75Qxpyf0prVvImu4gqxg==");
	result.cloudSaveId = obj[0]["0 cloudSaveId"];

	return result;
}