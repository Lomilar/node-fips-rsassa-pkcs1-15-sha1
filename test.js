const crypto = require('crypto');
const pemJwk = require('pem-jwk');

let pkJwk = pemJwk.pem2jwk(Buffer.from("-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtLvW41hTJvxm5Kq90/9M\r\nLUy50Z0lMDuDyOEovh8IDm3z0wehtYbzHIP6uCtrlVwCcjgrk6BJrlV7/+ijx8GI\r\nbkdCQkc9RRRy6GztTaDGDlQ5iYZchm5aNpsGOeN5dOnmvzBaf7r5GyUkbzweFRU0\r\nyosh0RLJWh1nJZSvvZmYBbJSe+oTvarM5UbwLJ7H3Nl1iY4XQy3Ha0vh+6lIMN87\r\nwWVDwnT/iReA0Ar0Uvv0fMdMqtqoNhqnBPN+foHewjarDpHBN+TbAjB+yavDuYEx\r\n3UWClxviQ9hooQ8uGNPytJ/RuJlsnNEsD0rVtoyuRuVq3nzF/8y63PVdYtLoJ77E\r\nCQIDAQAB\r\n-----END PUBLIC KEY-----\r\n"));
let ppkJwk = pemJwk.pem2jwk(Buffer.from("-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpQIBAAKCAQEAtLvW41hTJvxm5Kq90/9MLUy50Z0lMDuDyOEovh8IDm3z0weh\r\ntYbzHIP6uCtrlVwCcjgrk6BJrlV7/+ijx8GIbkdCQkc9RRRy6GztTaDGDlQ5iYZc\r\nhm5aNpsGOeN5dOnmvzBaf7r5GyUkbzweFRU0yosh0RLJWh1nJZSvvZmYBbJSe+oT\r\nvarM5UbwLJ7H3Nl1iY4XQy3Ha0vh+6lIMN87wWVDwnT/iReA0Ar0Uvv0fMdMqtqo\r\nNhqnBPN+foHewjarDpHBN+TbAjB+yavDuYEx3UWClxviQ9hooQ8uGNPytJ/RuJls\r\nnNEsD0rVtoyuRuVq3nzF/8y63PVdYtLoJ77ECQIDAQABAoIBADJg2blteWA4owXC\r\ngj+Bvl4yMOm5ABC9xjJMcOruA3TiOUDts6nCACpGr7B+ifKMPzJPbfYsi91IftQK\r\nqPyZecojmtiWuwFyfcVD97HXyt1bpN4s0cW3JPZrqASi38wzFtrcQ52vJJjodYt8\r\nGnaN/rUmqzp4HiA8afATzhjvo2ySm/ZEj1b2zkJOVRUV5Pneo00peiyJauYGoyPv\r\nxnjHPyjOqib8/0BQM4jURgD0H8DnSnhYX3O5QQRciu9cqdvlQTR8942IpSbnZW28\r\nynA3iP+zrx4VrRGxTT9cc5CrzBggjlevtY95UIIak0MAuY3JuG57ji+dLFQOgOXJ\r\nkuFy7gECgYEA69vsQm5wGcxPkSVoiOkrFPWnue5a5IRR/q5nviXC4x4zYv1LFTeC\r\n6oG3evXRn1DJQAz9AY2SBLJaO5hMsMVK8TxLsMea/3rKhqvCQ4vi0CZt1amt8xiZ\r\ntsWspKJGK6zGkYwtqiN08991XqgpDg24V0S8VzHKH2rGSWksTY2CgVkCgYEAxCrU\r\nprcDBUHvBxZOCkOeuMEDPemnVw336N8DLFAW6Oulwb+9BsahJTrgv01wuhx6jf6+\r\nbn2WE6RN0nSluDXFtKPUjb2yXHXKIjKfAIdHJOfvvUVBYgh1QB0OhtAU24wvCQM/\r\nkkdgJL6BQJr5Ohz9rfim3NnYvEbQcesKw3rR0jECgYEA377Kux5/U8nhNWVSbIcd\r\nqo18JsM6EIyCKGOU4Op7ne85ek+lWaRGmmaiA5CM4mDF+fAYV8/QVIpJVT2eixcu\r\nh/jWKQbCQFhhJi5sZJ2gdivuiAGmlfWhZKTTqX6TqL0Hxm0/qKZoPS2f70MBZ2aW\r\nmJsJPIJsJy+omV2ffJag1kkCgYEADpYEs9S908FATa2Z5ed7QM+RNyRNfgqa2WTj\r\nroLSAUWsUIi6PGu+ha8oEPFoJV6CulYrwLlz1EgORUzJGbZd2f2oi1WEkp1rhzlu\r\nWzKz1omsaM1ifDCWz0qZzupf8qcsxCXKr0zBWFoV8EDVsT2Am1P2zEsic3VsgFvy\r\ns/BI87ECgYEA0ZpToYrBoGp5gExhh6vsj9npyzkYa7vLPZBn1ot844gx+fQJ0Xsy\r\naxWPwPIwuoT0hsnLX/8m4q5nXg8ybW1qS2GZsBUgUrlHfHijo6j4QCBNcTl3kizJ\r\ny+rTK0QpcTvYHwfGa5P2DDfEcfgxSiQAp5uWwyil2qcVJrgL6jcwaBk=\r\n-----END RSA PRIVATE KEY-----\r\n"));

var enc = Buffer.from("This is a string converted to a Uint8Array");

let encrypted = null;
let decrypted = null;
let signature = null;

let encrypt = async ()=>{
    let keyUsages = ["encrypt"];
    let algorithm = {name:"RSA-OAEP",hash:"SHA-1"};
    let key = await crypto.webcrypto.subtle.importKey("jwk", pkJwk, algorithm, false, keyUsages);
    encrypted = await crypto.webcrypto.subtle.encrypt(algorithm,key,enc);
}
let decrypt = async ()=>{
    let keyUsages = ["decrypt"];
    let algorithm = {name:"RSA-OAEP",hash:"SHA-1"};
    let key = await crypto.webcrypto.subtle.importKey("jwk", ppkJwk, algorithm, false, keyUsages);
    decrypted = await crypto.webcrypto.subtle.decrypt(algorithm,key,encrypted);
}
let sign = async ()=>{
    let keyUsages = ["sign"];
    let algorithm = {name:"RSASSA-PKCS1-v1_5",hash:"SHA-1"};
    let key = await crypto.webcrypto.subtle.importKey("jwk", ppkJwk, algorithm, false, keyUsages);
    signature = await crypto.webcrypto.subtle.sign(algorithm,key,enc);
}
let verify = async ()=>{
    let keyUsages = ["verify"];
    let algorithm = {name:"RSASSA-PKCS1-v1_5",hash:"SHA-1"};
    let key = await crypto.webcrypto.subtle.importKey("jwk", pkJwk, algorithm, false, keyUsages);
    return await crypto.webcrypto.subtle.verify(algorithm,key,signature,enc);
}
let sign256 = async ()=>{
    let keyUsages = ["sign"];
    let algorithm = {name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"};
    let key = await crypto.webcrypto.subtle.importKey("jwk", ppkJwk, algorithm, false, keyUsages);
    signature = await crypto.webcrypto.subtle.sign(algorithm,key,enc);
}
let verify256 = async ()=>{
    let keyUsages = ["verify"];
    let algorithm = {name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"};
    let key = await crypto.webcrypto.subtle.importKey("jwk", pkJwk, algorithm, false, keyUsages);
    return await crypto.webcrypto.subtle.verify(algorithm,key,signature,enc);
}
(async()=>{
    console.log(enc);
    console.log("FIPS: " + crypto.getFips());
    console.log("Encrypting using RSA-OAEP, 2048 bit public key.")
    await encrypt();
    console.log(encrypted);
    console.log("Decrypting using RSA-OAEP, 2048 bit private key.")
    await decrypt();
    console.log(decrypted);
    console.log("Signing using RSASSA-PKCS1-v1_5 and SHA-256, 2048 bit private key.")
    await sign256();
    console.log(signature);
    console.log("Verifying using RSASSA-PKCS1-v1_5 and SHA-256, 2048 bit public key.")
    console.log(await verify256());
    signature = null;
    console.log("Signing using RSASSA-PKCS1-v1_5 and SHA-1, 2048 bit private key.")
    await sign();
    console.log(signature);
    console.log("Verifying using RSASSA-PKCS1-v1_5 and SHA-1, 2048 bit public key.")
    console.log(await verify());
})();