# Galway Bus API

## About 

Until 2020 Transport for Ireland provided bus information (including realtime) via the RTPI REST api. The data is still available, now in GTFS and GTFS-R (specifications). Consequently the barrier for entry is higher and tedious.

Dealing with GTFS involves two things

1. **Static information** - routes, timetables, bus stops etc. It can be downloaded from [transportforireland.ie](https://www.transportforireland.ie/transitData/PT_Data.html) . Some of the files are BIG and you need to put it into a database and write some fairly annoying queries to get anything meaningful.
2. **GTFS-R feed** - this is the realtime information. You can sign up for a GTFS-R feed key at [developer.nationaltransport.ie](https://developer.nationaltransport.ie/api-details#api=gtfsr&operation=gtfsr) and read about the specification at gtfs.org. The feed data is only useful in conjunction with the static data.

Galway Bus API is a REST API that serves all this information for Galway City Buses without any GTFS palava.

### Read More

https://galway-bus.apis.ie

### Base Url

https://galway-bus.apis.ie/api


### Website Demo

https://busload.ie

