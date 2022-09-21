FROM node:18.8

RUN apt update
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -qqy build-essential checkinstall zlib1g-dev wget libssl-dev curl clang

RUN openssl version
RUN cd /usr/local/src && wget https://www.openssl.org/source/openssl-3.0.5.tar.gz && tar xvf openssl-3.0.5.tar.gz && cd openssl-3.0.5 && ./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib enable-fips linux-x86_64 && make -j8 > make.log && make install > makeinstall.log && make install_ssldirs > makeinstallssldirs.log && make install_fips > makeinstallfips.log && cd /
RUN openssl version

RUN git clone https://github.com/nodejs/node.git -b v18.3.0
RUN cd node && export OPENSSL_ENABLE_MD5_VERIFY=true && export OPENSSL_CONF=/usr/local/ssl/openssl.cnf && export OPENSSL_MODULES=/usr/local/ssl/lib64/ossl-modules && ./configure --shared-openssl --shared-openssl-libpath=/usr/local/ssl/lib64 --shared-openssl-includes=/usr/local/ssl/include --shared-openssl-libname=crypto,ssl --openssl-is-fips > configure.log && export LD_LIBRARY_PATH=/usr/local/ssl/lib64 && make -j8 > make.log && make install > makeinstall.log && cd ..

ENV OPENSSL_ENABLE_MD5_VERIFY=true
ENV OPENSSL_CONF=/usr/local/ssl/openssl.cnf
ENV OPENSSL_MODULES=/usr/local/ssl/lib64/ossl-modules
ENV LD_LIBRARY_PATH=/usr/local/ssl/lib64

RUN echo '.include /usr/local/ssl/fipsmodule.cnf' >> /usr/local/ssl/openssl.cnf
RUN echo '[provider_sect]' >> /usr/local/ssl/openssl.cnf
RUN echo 'default = default_sect' >> /usr/local/ssl/openssl.cnf
RUN echo 'fips = fips_sect' >> /usr/local/ssl/openssl.cnf
RUN echo '[default_sect]' >> /usr/local/ssl/openssl.cnf
RUN echo 'activate = 1' >> /usr/local/ssl/openssl.cnf

COPY package.json package.json
RUN npm install
COPY test.js test.js

RUN node -v

ENTRYPOINT node --force-fips test.js