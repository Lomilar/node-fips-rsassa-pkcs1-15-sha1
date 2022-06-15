This project is intended to reproduce a bug in Node 18 when compiled with OpenSSL 3.0.3 and FIPS extensions.

When attempting to cryptographically sign a message using `{name:"RSASSA-PKCS1-v1_5",hash:"SHA-1"}`:

The following error occurs:
```
#
# Fatal error in HandleScope::HandleScope
# Entering the V8 API without proper locking in place
#
```

When signing using SHA-256, this error does not occur.

When attempting to sign using an invalid hash, as in MD5, we get a better error.

```
DOMException [NotSupportedError]: Unrecognized name.
    at new DOMException (node:internal/per_context/domexception:51:5)
    at __node_internal_ (node:internal/util:497:10)
    at normalizeAlgorithm (node:internal/crypto/util:220:15)
    at normalizeAlgorithm (node:internal/crypto/util:224:16)
    at SubtleCrypto.importKey (node:internal/crypto/webcrypto:522:15)
    at sign (/test.js:28:45)
    at /test.js:65:11
```

The Dockerfile contains what I believe to be a correct way to adapt the Node 18 module to use the OpenSSL 3.0.3 library.

# Happy Path

`npm test`

# Sad Path
Note: OpenSSL and Node are being compiled from source, this takes some time.

`npm run dockerTest`