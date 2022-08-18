import { DataCore } from "./DataCore";

const dataCore = new DataCore();

let data1 = dataCore.getSegmentOrCreate({ type: "persistent", name: "data1" });

data1.set("abc", {test: "aaa"});

let _data1 = dataCore.getSegmentOrCreate({ type: "persistent", name: "data1" });

let scopedData = dataCore.getSegmentOrCreate({ type: "volatile", name: "data1", scopeId: 1 });
scopedData.set("abc", {test: "bbb"});

let _scopedData = dataCore.getSegmentOrCreate({ type: "volatile", name: "data1", scopeId: 1 });
console.log(_scopedData.get("abc"));
console.log(_scopedData.get("data1"));


console.log(_data1.get("abc"));
console.log(_data1.get("data1"));

dataCore.deleteSegment({ type: "persistent", name: "data1" });

console.log(dataCore.getSegmentOrCreate({ type: "persistent", name: "data1" }).get("abc"));