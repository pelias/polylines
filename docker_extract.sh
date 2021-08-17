#!/bin/bash
set -euo pipefail

# ensure data subdirectory exists
mkdir -p /data/polylines/;

# enumerate a list of PBF files
shopt -s nullglob
PBF_FILES=(/data/openstreetmap/*.pbf);

# ensure there is at least one PBF file in the osm directory
if [[ ${#PBF_FILES[@]} -eq 0 ]]; then
  2>&1 echo 'no *.pbf files found in /data/openstreetmap directory';
  exit 1;
fi

# truncate polylines file
echo '' > /data/polylines/extract.0sv;

# iterate over all PBF files in the osm directory
for PBF_FILE in "${PBF_FILES[@]}"; do

  # give a warning if the filesize is over 1GB
  # the missinglink/pbf library is memory-bound and cannot safely handle very large extracts
  find "${PBF_FILE}" -maxdepth 1 -size +1G | while read file; do
    2>&1 echo '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!';
    2>&1 echo "${PBF_FILE} is very large.";
    2>&1 echo 'We strongly recommend using Valhalla to produce extracts for large PBF extracts.';
    2>&1 echo 'You can also download pre-processed polyline extracts from Geocode Earth.';
    2>&1 echo 'see: https://github.com/pelias/polylines#download-data';
    2>&1 echo '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!';
    
    2>&1 echo "Generating polylines from ${PBF_FILE} failed! The file is too large.";
    2>&1 echo "Exiting...";
    exit 1
  done

  # convert pbf file to 0sv (polylines) format, appending results to polyline file
  echo "converting ${PBF_FILE} to /data/polylines/extract.0sv";
  pbf streets "${PBF_FILE}" >> /data/polylines/extract.0sv;

done

# debugging info
echo 'wrote polylines extract';
ls -lah /data/polylines/extract.0sv;
