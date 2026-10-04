var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Config=Java.type('gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration'),Helper=Java.type('OfflineSpawner');
var Entity=Java.type('gloomyfolken.mods.stalker.mobs.entity.EntityMutant'),Skin=Java.type('gloomyfolken.mods.stalker.mobs.entity.MutantSkin');
var Bytes=Java.type('com.google.common.io.ByteStreams'),Unsafe=Java.type('sun.misc.Unsafe');
var uf=Unsafe.class.getDeclaredField('theUnsafe');uf.setAccessible(true);var unsafe=uf.get(null);
function set(obj,name,value){var f=Entity.class.getDeclaredField(name);f.setAccessible(true);f.set(obj,value);}
var worldType=Java.type('iyeh'),serverWorld=unsafe.allocateInstance(worldType.class),clientWorld=unsafe.allocateInstance(worldType.class);clientWorld.field_72995_K=true;
function init(entity,world){entity.field_70170_p=world;entity.field_70130_N=0.75;entity.field_70131_O=0.8;entity.field_70121_D=Java.type('net.minecraft.util.dfak')._a(0,0,0,0.75,0.8,0.75);set(entity,'defaultSkins',new (Java.type('java.util.ArrayList'))());set(entity,'mutantSkin',new Skin('',0.0));}
var types={dog:'EntityDog',cat:'EntityCat',boar:'EntityBoar',doge:'EntityDoge',flesh:'EntityFlesh',psidog:'EntityPsidog',pseudodog:'EntityPseudodog',psidog_clone:'EntityPsidogClone',chimera:'EntityChimera',snork:'EntitySnork',krovosos:'EntityKrovosos',pseudogigant:'EntityPseudogigant',tushkan:'EntityTushkan'};
// Resolve the real registry's class map without initializing the resource-heavy singleton.
var Jar=Java.type('java.util.jar.JarFile'),CR=Java.type('org.objectweb.asm.ClassReader'),CN=Java.type('org.objectweb.asm.tree.ClassNode');
var jar=new Jar((offlineHome+'/classes/classes.jar'));
var e=jar.entries(),actual={};while(e.hasMoreElements()){var item=e.nextElement(),n=String(item.getName());if(!n.startsWith('gloomyfolken/mods/stalker/mobs/entity/mutants/')||!n.endsWith('.class'))continue;var node=new CN();try{new CR(jar.getInputStream(item)).accept(node,0);}catch(ignore){continue;}for(var key in types)if(node.name==='gloomyfolken/mods/stalker/mobs/entity/mutants/'+types[key])actual[key]=String(node.name).replace(/\//g,'.');}jar.close();
for(var name in types){
 var type=actual[name];if(!type)throw new Error('No real class for '+name);
 var T=Java.type(type),server=unsafe.allocateInstance(T.class),client=unsafe.allocateInstance(T.class);init(server,serverWorld);init(client,clientWorld);
 var defaults=new (Java.type('java.util.ArrayList'))();set(server,'defaultSkins',defaults);
 var parent=T.class,add=null;while(add===null){try{add=parent.getDeclaredMethod('addDefaultSkins',Java.to([],'java.lang.Class[]'));}catch(missing){parent=parent.getSuperclass();}}add.setAccessible(true);add.invoke(server,Java.to([],'java.lang.Object[]'));
 if(defaults.isEmpty())throw new Error('No default skins '+name);
 var skin=defaults.get(0),path=(offlineHome+'/game/modassets/assets/stalkermobs/models/')+name+'/'+(skin.getSkinName().length()?skin.getSkinName():name)+'.mcxd';
 if(!Java.type('java.nio.file.Files').exists(Java.type('java.nio.file.Paths').get(path)))throw new Error('Missing default model '+path);
 var config=new Config();config.getCommon().setEntityClass(name);config.getCommon().setName('local_spawn_'+name);config.getHealth().setMaxHealthPoints(73.0);
 set(server,'defaultSkins',new (Java.type('java.util.ArrayList'))());server.setConfiguration(config);
 if(server.getSkin().getSkinName()!==skin.getSkinName())throw new Error('Production server skin setup failed '+name);
 var out=Bytes.newDataOutput();server.writeSpawnData(out);
 var input=Bytes.newDataInput(out.toByteArray());client.readSpawnData(input);
 if(!client.hasConfiguration()||client.getProperties().getCommon().getEntityClass()!==name||client.getProperties().getHealth().getMaxHealthPoints()!==73||client.getProperties().getCommon().getName()!=='local_spawn_'+name||client.getSkin().getSkinName()!==skin.getSkinName())throw new Error('Bad packet roundtrip '+name);
 // A second copy must also work without shared server-side state.
 var repeat=unsafe.allocateInstance(T.class);init(repeat,clientWorld);repeat.readSpawnData(Bytes.newDataInput(out.toByteArray()));if(!repeat.hasConfiguration())throw new Error('Repeat lost config');
 var empty=unsafe.allocateInstance(T.class);if(empty.func_70097_a(null,1.0)!==false)throw new Error('Unconfigured damage guard failed');
 print('PACKET OK '+name+' skin='+skin.getSkinName()+' bytes='+out.toByteArray().length);
}
print('REAL SPAWN PACKET TEST PASSED: 13 mutants, repeated receive, non-default health, default model availability, early damage guard');
