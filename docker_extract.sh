#!/bin/bash
set -euo pipefail

# ensure data subdirectory exists
mkdir -p /data/polylines/;
mkdir -p /data/valhalla/valhalla_tiles

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

# create empty sqlite db for valhalla
touch /data/valhalla/valhalla_tiles/timezones.sqlite
touch /data/valhalla/valhalla_tiles/admins.sqlite

# iterate over all PBF files in the osm directory
for PBF_FILE in "${PBF_FILES[@]}"; do

  # convert pbf file to 0sv (polylines) format, appending results to polyline file
  echo "converting ${PBF_FILE} to /data/polylines/extract.0sv";

  if [[ -n $(find "${PBF_FILE}" -maxdepth 1 -size +1G) ]]; then
    # Use Valhalla to generate polylines
    valhalla_build_tiles -c valhalla.json /data/openstreetmap/*.osm.pbf;
    find /data/valhalla/valhalla_tiles | sort -n | tar cf /data/valhalla/valhalla_tiles.tar --no-recursion -T -
    valhalla_export_edges --config valhalla.json >> /data/polylines/extract.0sv;
  else
    pbf streets "${PBF_FILE}" >> /data/polylines/extract.0sv;
  fi

done

# debugging info
echo 'wrote polylines extract';
ls -lah /data/polylines/extract.0sv;
