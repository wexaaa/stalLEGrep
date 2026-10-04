var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Incremental patch: keep all case, balance and existing spawner hooks intact.
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths'),Str=Java.type('java.lang.String');
var CP=Java.type('javassist.ClassPool'),Method=Java.type('javassist.CtNewMethod');
var root=(offlineHome+'/'),source=root+'classes/offline-patches.jar';
var pool=new CP(true);pool.appendClassPath(source);pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var helper=pool.get('OfflineSpawner');
var blocks=String(new Str(Files.readAllBytes(Paths.get('work/OfflineSpawner.methods.java')),'UTF-8')).split('// METHOD').filter(function(s){return s.trim().length>0;});
for each(var src in blocks){var sig=src.substring(0,src.indexOf('{')),name=sig.substring(0,sig.indexOf('(')).trim().split(/\s+/).pop();
 try{helper.getDeclaredMethod(name);}catch(e){helper.addMethod(Method.make(sig+'{return null;}',helper));}
}
for each(var src in blocks){var m=Method.make(src,helper);helper.removeMethod(helper.getDeclaredMethod(m.getName()));helper.addMethod(m);}
var mutant=pool.get('gloomyfolken.mods.stalker.mobs.entity.EntityMutant');
var Editor=Java.extend(Java.type('javassist.expr.ExprEditor'));
var writes=0,reads=0;
mutant.getDeclaredMethod('writeSpawnData').instrument(new Editor({edit:function(call){
 if(!(call instanceof Java.type('javassist.expr.MethodCall')))return;
 if(call.getClassName()==='gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration$Companion$Common' && call.getMethodName()==='getName'){
  call.replace('{ $_ = OfflineSpawner.spawnConfig(getProperties()); }');writes++;
 }
}}));
mutant.getDeclaredMethod('readSpawnData').instrument(new Editor({edit:function(call){
 if(!(call instanceof Java.type('javassist.expr.MethodCall')))return;
 if(call.getClassName()==='gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper' && call.getMethodName()==='getMobConfiguration'){
  call.replace('{ $_ = OfflineSpawner.resolveSpawnConfig($1); }');reads++;
 }
}}));
if(writes!==1||reads!==1)throw new Error('Unexpected spawn protocol: '+writes+'/'+reads);
// The recovered frontend-only configuration callback is empty. Restore default skin selection on the server.
mutant.getDeclaredMethod('setConfiguration').insertAfter('{ if (hasConfiguration() && !field_70170_p.field_72995_K && !field_70128_L) { if(defaultSkins.isEmpty()) addDefaultSkins(); if(mutantSkin.getSkinName().length()==0) { java.util.List skins=getRandomSkins(); if(!skins.isEmpty()) mutantSkin=(gloomyfolken.mods.stalker.mobs.entity.MutantSkin)skins.get(0); } } }');
// Ignore a stray damage/status packet until the client's spawn data has been applied.
mutant.getDeclaredMethod('func_70097_a').insertBefore('{ if(!hasConfiguration()) return false; }');
var replacements={'OfflineSpawner.class':helper.toBytecode(),'gloomyfolken/mods/stalker/mobs/entity/EntityMutant.class':mutant.toBytecode()};
var Jar=Java.type('java.util.jar.JarFile'),Zip=Java.type('java.util.zip.ZipOutputStream'),Entry=Java.type('java.util.zip.ZipEntry'),BA=Java.type('byte[]');
var base=new Jar(source),out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-spawner-fixed.jar'))),iter=base.entries(),names={};
while(iter.hasMoreElements()){var e=iter.nextElement(),name=String(e.getName());names[name]=true;out.putNextEntry(new Entry(name));if(replacements[name])out.write(replacements[name]);else{var stream=base.getInputStream(e),b=new BA(8192),n;while((n=stream.read(b))>0)out.write(b,0,n);stream.close();}out.closeEntry();}
for(var name in replacements)if(!names[name]){out.putNextEntry(new Entry(name));out.write(replacements[name]);out.closeEntry();}
out.close();base.close();print('BUILT work/offline-patches-spawner-fixed.jar: config transmission, default skins, unconfigured damage guard');
