# use multi-stage build to make pbf binary
FROM pelias/baseimage as builder

RUN apt-get update && apt-get install gcc -y

# install Golang
ENV GOPATH=/go
RUN wget -qO- https://golang.org/dl/go1.15.2.linux-amd64.tar.gz | tar -C /usr/local -xzf -
ENV PATH="${PATH}:/usr/local/go/bin"
ENV GO111MODULE=on

# install pbf dependency
RUN go get github.com/missinglink/pbf

# use Pelias baseimage for the main image
FROM pelias/baseimage

# change working dir
ENV WORKDIR /code/pelias/polylines
WORKDIR ${WORKDIR}

# copy pbf binary from builder container
COPY --from=builder /go/bin/pbf /bin/

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
