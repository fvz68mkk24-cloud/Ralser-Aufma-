(function(root){
'use strict';
const measurementIds=['hl','hm','hr','bo','bm','bu'];
const clone=x=>JSON.parse(JSON.stringify(x));
function validateRecords(records){if(!records||typeof records!=='object'||Array.isArray(records))throw Error('Ungültige Aufmaße');for(const v of Object.values(records))if(!v||typeof v.data!=='object'||!v.data||Array.isArray(v.data)||typeof v.updated!=='string')throw Error('Ungültiger Aufmaß-Eintrag');}
function validate(db){if(!db||db.version!==8)throw Error('Ungültige Version');validateRecords(db.records);for(const key of ['customers','projects'])if(!db[key]||typeof db[key]!=='object'||Array.isArray(db[key]))throw Error('Ungültige Verwaltung');for(const c of Object.values(db.customers))if(!c||typeof c.name!=='string')throw Error('Ungültiger Kunde');for(const p of Object.values(db.projects))if(!p||typeof p.name!=='string'||!db.customers[p.customerId])throw Error('Ungültiges Bauvorhaben');for(const r of Object.values(db.records))if(!db.customers[r.customerId]||!db.projects[r.projectId]||db.projects[r.projectId].customerId!==r.customerId)throw Error('Ungültige Zuordnung');return db;}
function migrate(records){validateRecords(records);const db={version:8,customers:{},projects:{},records:{}};const names=new Map();let n=0;for(const [id,record] of Object.entries(records)){const name=String(record.data.kunde||'Ohne Kunde');const key=name.trim().toLocaleLowerCase('de');let customerId=names.get(key);if(!customerId){customerId='legacy-c'+(++n);names.set(key,customerId);db.customers[customerId]={name};db.projects['legacy-p'+n]={name:'Altbestand – Bauvorhaben zuordnen',customerId};}const projectId=Object.keys(db.projects).find(k=>db.projects[k].customerId===customerId);Object.defineProperty(db.records,id,{value:{...clone(record),customerId,projectId},enumerable:true,writable:true,configurable:true});}return validate(db);}
function number(value){if(value===null||value===undefined||String(value).trim()==='')return null;const s=String(value).trim().replace(',','.');if(!/^\d+(\.\d+)?$/.test(s))return null;const n=Number(s);return Number.isFinite(n)?n:null;}
function floorDeductions(d){return d.kind==='Innentür'&&d.tuerart==='Schiebetür'?{laid:0,wood:14,vinyl:4}:{laid:3,wood:17,vinyl:7};}
function isFutterstock(d){return d.kind==='Innentür'&&d.tuerart==='Futterstock';}
function futterGroup(entries){
 const doors=entries.filter(r=>isFutterstock(r.data));
 function dimension(keys){
  const items=doors.map(r=>{const values=keys.map(k=>number(r.data[k]));const maximum=values.every(v=>v!==null&&v>0)?Math.max(...values):null;return {id:r.id,position:String(r.data.position||'ohne Position'),maximum,lower:maximum===null?null:maximum-30,upper:maximum===null?null:maximum-20};});
  if(!items.length)return {status:'empty',value:null,items};
  if(items.some(i=>i.maximum===null))return {status:'incomplete',value:null,items};
  const lower=Math.max(...items.map(i=>i.lower)),upper=Math.min(...items.map(i=>i.upper));
  return {status:lower<=upper&&upper>0?'ok':'conflict',value:lower<=upper&&upper>0?upper:null,lower,upper,items};
 }
 return {count:doors.length,height:dimension(['hl','hm','hr']),width:dimension(['bo','bm','bu'])};
}
function futterResult(d,group){
 const max=keys=>{const values=keys.map(k=>number(d[k]));return values.every(v=>v!==null&&v>0)?Math.max(...values):null;};
 const h=max(['hl','hm','hr']),w=max(['bo','bm','bu']);
 return {height:group.height.value,width:group.width.value,deduction:h!==null&&group.height.value!==null?h-group.height.value:null,widthDeduction:w!==null&&group.width.value!==null?w-group.width.value:null,futterstock:true,group};
}
function calculateProject(records,projectId){
 const entries=Object.entries(records).filter(([,r])=>r.projectId===projectId).map(([id,r])=>({id,data:r.data}));const group=futterGroup(entries);const results={};
 for(const r of entries)Object.defineProperty(results,r.id,{value:isFutterstock(r.data)?futterResult(r.data,group):finished(r.data),enumerable:true});
 return {results,futterstock:group};
}
function finished(d){if(isFutterstock(d))return futterResult(d,futterGroup([{id:'single',data:d}]));const hs=['hl','hm','hr'].map(k=>number(d[k]));const ws=['bo','bm','bu'].map(k=>number(d[k]));let deduction=d.kind==='Haustür'?3:(floorDeductions(d)[d.floorFinish]??(d.floorFinish==='custom'?number(d.customDeduction):(!d.floorFinish&&d.boden==='Ja'?floorDeductions(d).laid:null)));const h=hs.every(x=>x!==null&&x>0)&&deduction!==null?(d.kind==='Haustür'||d.tuerart==='Schiebetür'?Math.max(...hs):Math.min(...hs))-deduction:null;const w=ws.every(x=>x!==null&&x>0)?(d.kind==='Haustür'||d.tuerart==='Schiebetür'||(d.kind==='Innentür'&&d.tuerart==='Pfostenstock')?Math.max(...ws):Math.min(...ws))-(d.kind==='Haustür'||(d.kind==='Innentür'&&d.tuerart==='Pfostenstock')?3:0):null;return {height:h>0?h:null,width:w>0?w:null,deduction};}
function merge(base,incoming){validate(base);validate(incoming);const out=clone(base);const maps={customers:{},projects:{}};for(const type of ['customers','projects'])for(const [id,original] of Object.entries(incoming[type])){const v=clone(original);if(type==='projects')v.customerId=maps.customers[v.customerId];let target=id;let n=1;while(out[type][target]&&JSON.stringify(out[type][target])!==JSON.stringify(v))target=id+'-import-'+n++;out[type][target]=v;maps[type][id]=target;}for(const [id,original] of Object.entries(incoming.records)){const v={...clone(original),customerId:maps.customers[original.customerId],projectId:maps.projects[original.projectId]};let target=id;let n=1;while(out.records[target]&&JSON.stringify(out.records[target])!==JSON.stringify(v))target=id+'-import-'+n++;Object.defineProperty(out.records,target,{value:v,enumerable:true,writable:true,configurable:true});}return validate(out);}
root.Ralser={measurementIds,migrate,validate,finished,floorDeductions,merge,isFutterstock,calculateProject};if(typeof module!=='undefined')module.exports=root.Ralser;
})(typeof window==='undefined'?globalThis:window);
