import json
with open("tpl_percorsi.geojson", "r") as f:
    data = json.load(f)

lanes = data["features"]

BUS = []
FILOBUS = []
TRAM = []

for lane in lanes:
    if lane["properties"]["mezzo"] == "BUS":
        BUS.append(lane)
    elif lane["properties"]["mezzo"] == "FILOBUS":
        FILOBUS.append(lane)
    elif lane["properties"]["mezzo"] == "TRAM":
        TRAM.append(lane)

with open("tpl_percorsi_bus.geojson", "w") as f:
    json.dump({
        "type": "FeatureCollection",
        "name": "tpl_percorsi",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": BUS
    }, f)

with open("tpl_percorsi_filobus.geojson", "w") as f:
    json.dump({
        "type": "FeatureCollection",
        "name": "tpl_percorsi",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": FILOBUS
    }, f)

with open("tpl_percorsi_tram.geojson", "w") as f:
    json.dump({
        "type": "FeatureCollection",
        "name": "tpl_percorsi",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": TRAM
    }, f)