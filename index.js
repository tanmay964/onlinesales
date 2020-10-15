let ts = "./index.csv";
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
let mapStore = new Map();
 
fs.createReadStream(ts)
  .pipe(csv())
  .on('data', (data) => results.push(data))
    .on('end', () => {
      let arr = [];
    results.forEach(function(item) {
      
      if (item.occurences !== 'null' ) {
          arr.push(item.bug_id);
        }
    });
      var map = new Map();
      results.forEach(function(item) {
        let str = item.parent_bug_id + '$' + item.occurences +'$'+ item.percentage_contribution;
        if (!map.has(item.bug_id)) { 
          map.set(item.bug_id, [str]);
        }
        else {
          let arr = map.get(item.bug_id);
          arr.push(str);
          map.set(item.bug_idm,[arr]);
        }
        
      
      });
       
       var mapFinal=new Map();
      for (let i = 0;i<arr.length;i++){
        let node = arr[i];
        let map1 = new Map();
        let score = "";

        
        let map2 = getMapScore(node, map, map1,score);
        mapFinal = map2;
      }
      let max =0;
      let key1 ;
      mapFinal.forEach(function (values,keys) {
        if (values>max) { 
          max = values;
          key1 = keys;
        }
      })
      console.log("most abundent bug is "+key1);
    
    });
function getMapScore(node, map, map1,score) {
  let arr = map.get(node);
  let map3 = new Map();
  if (!map.has(node)) {
    return map1;
  }
  
  for (let i = 0; i < arr.length; i++){
    let arrValue = arr[i];
    let newArray = arrValue.split('$');
    let parent_bug = newArray[0];
    let occurence = newArray[1];
    let percentage = newArray[2];
 
    console.log(parent_bug + " " + occurence + " " + percentage);
    let score1;
    if (occurence == 'null') {
      score1 = (score * percentage) / 100;
      console.log(score1);
    }
    else {
      score1 = (occurence * percentage) / 100;
      console.log(score1);
    }
    let str = parent_bug + "$" + score1 + "$" + percentage;
   
    if (mapStore.has(parent_bug)) {
      console.log(parent_bug + " " + map1.get(parent_bug));
      let val = mapStore.get(parent_bug);
      mapStore.set(parent_bug, val + score1);
    }
    else {
      mapStore.set(parent_bug, score1);
      console.log(parent_bug + " " + map1.get(parent_bug));
    }
    mapStore.forEach(function (values,keys) {
      console.log(values + " " + keys);
    })
   map3= getMapScore(parent_bug,map,mapStore,score1);
  }
  return map3;
  }
  console.log("results are"+results);

  