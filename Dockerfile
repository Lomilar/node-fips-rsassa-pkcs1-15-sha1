FROM node:20

RUN apt update
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -qqy build-essential checkinstall zlib1g-dev wget libssl-dev curl clang

RUN openssl version
RUN cd /usr/local/src && wget https://www.openssl.org/source/openssl-3.0.8.tar.gz && tar xvf openssl-3.0.8.tar.gz && cd openssl-3.0.8 && ./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib enable-fips linux-x86_64 && make -j8 > make.log && make install > makeinstall.log && make install_ssldirs > makeinstallssldirs.log && make install_fips > makeinstallfips.log && cd /
RUN openssl version

ENV OPENSSL_CONF=/usr/local/ssl/nodejs.cnf
ENV OPENSSL_MODULES=/usr/local/ssl/lib64/ossl-modules

RUN echo 'nodejs_conf = nodejs_init' >> /usr/local/ssl/nodejs.cnf
RUN echo '.include /usr/local/ssl/fipsmodule.cnf' >> /usr/local/ssl/nodejs.cnf
RUN echo '[nodejs_init]' >> /usr/local/ssl/nodejs.cnf
RUN echo 'providers = provider_sect' >> /usr/local/ssl/nodejs.cnf
RUN echo '[provider_sect]' >> /usr/local/ssl/nodejs.cnf
RUN echo 'default = default_sect' >> /usr/local/ssl/nodejs.cnf
RUN echo 'fips = fips_sect' >> /usr/local/ssl/nodejs.cnf
RUN echo '[default_sect]' >> /usr/local/ssl/nodejs.cnf
RUN echo 'activate = 1' >> /usr/local/ssl/nodejs.cnf

COPY package.json package.json
RUN npm install
COPY test.js test.js

RUN node -v

ENTRYPOINT node --force-fips test.js