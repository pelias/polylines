#!/bin/bash
set -euo pipefail

# ensure data subdirectory exists
mkdir -p /data/polylines/;

# find the first pbf file in the osm directory
PBF_FILE=$(ls -1 /data/openstreetmap/*.pbf || true | head -n1);
if [ -z "${PBF_FILE}" ]; then
  2>&1 echo 'no *.pbf files found in /data/openstreetmap directory';
  exit 1;
fi

# give a warning if the filesize is over 1GB
# the missinglink/pbf library is memory-bound and cannot safely handle very large extracts
find "${PBF_FILE}" -maxdepth 1 -size +1G | while read file; do
  2>&1 echo '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!';
  2>&1 echo "${PBF_FILE} is very large.";
  2>&1 echo 'You will likely experience memory issues working with large extracts like this.';
  2>&1 echo 'We strongly recommend using Valhalla to produce extracts for large PBF extracts.';
  2>&1 echo 'see: https://github.com/pelias/polylines#download!data';
  2>&1 echo '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!';
done

# convert pbf file to 0sv (polylines) format
echo "converting ${PBF_FILE} to /data/polylines/extract.0sv";
pbf streets "${PBF_FILE}" > /data/polylines/extract.0sv;

# debugging info
echo 'wrote polylines extract';
ls -lah /data/polylines/extract.0sv;
