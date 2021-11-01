# base image
FROM pelias/baseimage

# change working dir
ENV WORKDIR /code/pelias/polylines
WORKDIR ${WORKDIR}

# install Golang
ENV GOPATH=/usr/src/.go
RUN wget -qO- https://golang.org/dl/go1.15.2.linux-amd64.tar.gz | tar -C /usr/local -xzf -
RUN mkdir -p "${GOPATH}"
ENV PATH="${PATH}:/usr/local/go/bin:${GOPATH}/bin"
ENV GO111MODULE=on

# get go dependencies, temporarily installing GCC
RUN apt-get update && apt-get install -y gcc && go get github.com/missinglink/pbf && apt-get remove -y gcc && rm -rf /var/lib/apt/lists/*

# copy package.json first to prevent npm install being rerun when only code changes
COPY ./package.json ${WORKDIR}
RUN npm install

# copy code into image
ADD . ${WORKDIR}

# run tests
RUN npm test

USER pelias

# add convenience script - used to extract the first available pbf file to 0sv
ADD docker_extract.sh /code/pelias/polylines/docker_extract.sh
