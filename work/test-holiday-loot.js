var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
Java.type('java.lang.System').setProperty('read_derived','true');
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths');
var decoder=Java.type('gloomyfolken.mods.core.util.vjtu');
var parser=new (Java.type('com.google.gson.JsonParser'))();
var gson=Java.type('uyhq')._b;
var dir=Files.walk(Paths.get((offlineHome+'/game/modassets/assets/customitems')));
var iter=dir.iterator(),loot=null;
while(iter.hasNext()) {
 var path=iter.next();if(!String(path).endsWith('.eon'))continue;
 var json=parser.parse(decoder._c(Files.readAllBytes(path)));
 if(json.isJsonObject() && json.getAsJsonObject().has('временное_оружие')) {
   loot=gson.fromJson(json.getAsJsonObject().get('временное_оружие'),Java.type('mqpx').class);print('FOUND '+path);break;
 }
}
dir.close();
if(loot==null)throw new Error('Holiday loot table not found');
print('HOLIDAY groups='+loot.groups.size());
for each(var group in loot.groups.toArray()) print('GROUP '+group.name+' chance='+group.groupDropProbability+' entries='+group.entryList.size());
var Item=Java.type('lrhp');
for each(var group in loot.groups.toArray())for each(var entry in group.entryList.toArray()){
 var id=entry._c();if(id>0 && Item.field_77698_e[id]==null)new Item(id-256);
}
var C=Java.type('OfflineCases'),Stack=Java.type('voib');
new Item(25000-256);
var counts={};
for(var i=0;i<100;i++){
 var won=C.roll(loot),preview=C.preview(new Stack(25000,1,0),loot,won);
 if(preview.loot.groups.size()!==won.length)throw new Error('Holiday animation/reward count mismatch');
 counts[won.length]=(counts[won.length]||0)+1;
}
print('HOLIDAY REGRESSION PASSED: 100 real loot rolls, no extra reward stages; counts='+JSON.stringify(counts));
