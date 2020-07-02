
<template>
    <div id="app">
        <div class="wrapper">
        <div class="wrapperMap">
        <MglMap :accessToken="accessToken" :mapStyle="mapStyle" :center="center" :zoom="zoom"  >
      <MglGeojsonLayer
              :key="layers.id"
              :sourceId="layers.id"
              :source="layers.geoJsonSource"
              :layerId="layers.id"
              :layer="layers.geoJsonLayer"
              ref="pathLayer"
         />
            <MglMarker  v-for="i in points" :coordinates="i[0].geometry.coordinates" v-if="i.show"  color="blue" />
        </MglMap>
        </div>
        <div class="container"></div>
        <button class="marbut"  @click="handleClick">Нанести Маркеры</button>
        </div>
    </div>
</template>

<script>
  import $ from "jquery"
  import zone from './zone.json'
  import Mapbox from "mapbox-gl";
  import * as turf from '@turf/turf';
  import { MglMap, MglGeojsonLayer, MglMarker } from "vue-mapbox";

  export default {
    components: {
      MglMap,
      MglGeojsonLayer,
      MglMarker
    },
    data() {
      return {
        accessToken: 'pk.eyJ1IjoiZ292b3J1eGluMyIsImEiOiJja2MweGNoc2sxZ2J3MnJsajgzanRsdjVuIn0.4_QhVRJ5JLAYk-z6sGsHoQ', // your access token. Needed if you using Mapbox maps
        mapStyle: 'mapbox://styles/mapbox/streets-v11',// your map style
        center: [37.61, 55.7],
        zoom: 9,
        layers:
                {
                  id: "zone",
                  geoJsonSource: {
                    type: "geojson",
                    data: zone
                  },
                  geoJsonLayer: {
                    type: "fill",
                    layout: {},
                    "paint": {
                      "fill-opacity": 0.6,
                      "fill-color": "rgb(53, 175, 109)",
                      'fill-outline-color': 'white'
                    }
                  }
                },
          points: [],
          dataSector: [
              {
                  value: 0,
                  ABBREV: 'Троицкий',
                  proc: 0,
                  color: '#DC143C',
                  OKATO: "45298000"
              }, {
                  value: 0,
                  ABBREV: 'Новомосковский',
                  proc: 0,
                  color: '#C71585',
                  OKATO: "45297000"
              }, {
                  value: 0,
                  ABBREV: 'ЗелАО',
                  proc: 0,
                  color: '#FFA500',
                  OKATO: "45272000"
              }, {
                  value: 0,
                  ABBREV: 'ЮЗАО',
                  proc: 0,
                  color: '#FF00FF',
                  OKATO: "45293000"
              }, {
                  value: 0,
                  ABBREV: 'ЮВАО',
                  proc: 0,
                  color: '#F5DEB3',
                  OKATO: "45290000"
              }, {
                  value: 0,
                  ABBREV: 'ЦАО',
                  proc: 0,
                  color: '#800000',
                  OKATO: "45286000"
              }, {
                  value: 0,
                  ABBREV: 'САО',
                  proc: 0,
                  color: '#800000',
                  OKATO: "45277000"
              }, {
                  value: 0,
                  ABBREV: 'СЗАО',
                  proc: 0,
                  color: '#000080',
                  OKATO: "45283000"
              }, {
                  value: 0,
                  ABBREV: 'СВАО',
                  proc: 0,
                  color: '#808080',
                  OKATO: "45280000"
              }, {
                  value: 0,
                  ABBREV: 'ЮАО',
                  proc: 0,
                  color: '#F5DEB3',
                  OKATO: "45296000"
              }, {
                  value: 0,
                  ABBREV: 'ВАО',
                  proc: 0,
                  color: '#BC8F8F',
                  OKATO: "45263000"
              }, {
                  value: 0,
                  ABBREV: 'ЗАО',
                  proc: 0,
                  color: '#FF00FF',
                  OKATO: "45268000"
              }
          ]
      }
    },
    methods: {
      handleClick(){
          this.dataSector.map(function (i) {
              i.value = 0;
              i.proc = 0;
          });
          let pointscount  =[];
          do {
              let bbox = turf.bbox(zone);
              let point = turf.randomPoint(1, {bbox: bbox})
              dopoin(point,this);
          } while (pointscount.length < 100);
          function dopoin(point, t) {
              zone.features.map(function (i) {
                  if (turf.booleanPointInPolygon(point.features[0], i)) {

                      t.dataSector.map(function (item) {
                          if(item.OKATO === i.properties.OKATO){
                              item.value = item.value + 1;
                              point.features.color = item.color;
                          }
                      })
                      point.features.show = true;
                      pointscount.push(point.features)
                  }
              })

          }
          this.dataSector.map(function (i) {
              i.proc = (i.value * 100)/100;
          }.bind(this));
          this.points = pointscount;

          let maxValue = 25;
          let container = $('.container');
          let ttt = this;
          let addSector = function(data, startAngle, collapse) {
              let sectorDeg = 3.6 * data.proc;
              let skewDeg = 90 + sectorDeg;
              let rotateDeg = startAngle;
              if (collapse) {
                  skewDeg++;
              }
              let sector = $('<div>', {
                  'class': 'sector'
              }).css({
                  'background': data.color,
                  'transform': 'rotate(' + rotateDeg + 'deg) skewY(' + skewDeg + 'deg)'
              }).attr("id", data.color)
              .click(function(e) {
                      ttt.points.map(function (i) {
                          if(i.color ===e.target.id){
                              i.show = true;
                              console.log(i.color)
                          } else {
                              i.show = false;
                          }

                      })
                  ttt.$forceUpdate();
                  }.bind(ttt))
              container.append(sector);
              return startAngle + sectorDeg;
          };
          this.dataSector.reduce(function (prev, curr) {
              return (function addPart(data, angle) {
                  if (data.proc <= maxValue) {
                      return addSector(data, angle, false);
                  }
                  return addPart({
                      proc: data.proc - maxValue,
                      color: data.color
                  }, addSector({
                      proc: maxValue,
                      color: data.color,
                  }, angle, true));
              })(curr, prev);
          }, 0);

      }
    },
    created() {
      this.mapbox = Mapbox;
    }
  };
</script>


<style lang="scss">
#app {
 width: 100%;
  height: 100vh;
}
.wrapperMap{
    width: 50%;
    height: 50vh;
}
.container {
    width: 300px;
    height: 300px;
    overflow: hidden;
    border-radius: 50%;
    position: relative;

}

.sector {
    width: 50%;
    height: 50%;
    position: absolute;
    left: 50%;
    top: 0;
    transform-origin: left bottom;
    cursor: pointer;
}

.container:after {
    content: '';
    position: absolute;
    width: 50%;
    height: 50%;
    background: #fff;
    border-radius: 50%;
    top: 25%;
    left: 25%;
}
.marbut{
    height: 100px;
}


</style>
