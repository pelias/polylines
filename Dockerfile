# base image
FROM pelias/baseimage

# install go 1.10
ENV GOPATH=/usr/src/.go
RUN wget -qO- https://dl.google.com/go/go1.10.linux-amd64.tar.gz | tar -C /usr/local -xzf -
RUN mkdir -p "${GOPATH}"
ENV PATH="${PATH}:/usr/local/go/bin:${GOPATH}/bin"

# Install valhalla (Requires Ubuntu 16.04)
RUN add-apt-repository -y ppa:valhalla-core/valhalla && \
    apt-get update

RUN apt-get install -y valhalla-bin

# change working dir
ENV WORKDIR /code/pelias/polylines
WORKDIR ${WORKDIR}

# configure go environment
ENV GOPATH $HOME/go
ENV PATH $PATH:$GOROOT/bin:$GOPATH/bin

# get go dependencies
RUN go get github.com/missinglink/pbf

RUN valhalla_build_config \
  --mjolnir-tile-dir '/data/valhalla/valhalla_tiles' \
  --mjolnir-tile-extract '/data/valhalla/valhalla_tiles.tar' \
  --mjolnir-timezone '/data/valhalla/valhalla_tiles/timezones.sqlite' \
  --mjolnir-admin '/data/valhalla/valhalla_tiles/admins.sqlite' > valhalla.json

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
