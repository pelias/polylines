# base image
FROM pelias/baseimage

# install go 1.10
ENV GOPATH=/usr/src/.go
RUN wget -qO- https://dl.google.com/go/go1.10.linux-amd64.tar.gz | tar -C /usr/local -xzf -
RUN mkdir -p "${GOPATH}"
ENV PATH="${PATH}:/usr/local/go/bin:${GOPATH}/bin"

# change working dir
ENV WORKDIR /code/pelias/polylines
WORKDIR ${WORKDIR}

# configure go environment
ENV GOPATH $HOME/go
ENV PATH $PATH:$GOROOT/bin:$GOPATH/bin

# get go dependencies
RUN go get github.com/missinglink/pbf

# copy code into image
ADD . ${WORKDIR}

# install npm dependencies
RUN npm install

# run tests
RUN npm test

USER pelias

# add convenience script - used to extract the first available pbf file to 0sv
ADD docker_extract.sh /code/pelias/polylines/docker_extract.sh
