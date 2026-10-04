var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Incrementally update only the two helpers in the currently installed patch.
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths'),Str=Java.type('java.lang.String');
var CP=Java.type('javassist.ClassPool'),Method=Java.type('javassist.CtNewMethod');
var root=(offlineHome+'/'),source=arguments.length?String(arguments[0]):root+'classes/offline-patches.jar';
var pool=new CP(true);pool.appendClassPath(source);pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var helpers={},blocksByClass={},replacements={};
for each(var name in ['OfflineBalance','OfflineCases']){
 var helper=pool.get(name),blocks=String(new Str(Files.readAllBytes(Paths.get('work/'+name+'.methods.java')),'UTF-8')).split('// METHOD').filter(function(s){return s.trim().length>0;});
 helpers[name]=helper;blocksByClass[name]=blocks;
 for each(var block in blocks){var sig=block.substring(0,block.indexOf('{')),parts=sig.trim().split(/\s+/),ret=parts[2],methodName=parts[3].split('(')[0];
  try{helper.getDeclaredMethod(methodName);}catch(e){helper.addMethod(Method.make(sig+'{'+(ret==='void'?'':ret==='int'?'return 0;':ret==='boolean'?'return false;':'return null;')+'}',helper));}
 }
}
for(var name in helpers){var helper=helpers[name];for each(var block in blocksByClass[name]){var m=Method.make(block,helper);helper.removeMethod(helper.getDeclaredMethod(m.getName()));helper.addMethod(m);print('COMPILED '+name+'.'+m.getName());}}
for(var name in helpers)replacements[name+'.class']=helpers[name].toBytecode();
var Jar=Java.type('java.util.jar.JarFile'),Zip=Java.type('java.util.zip.ZipOutputStream'),Entry=Java.type('java.util.zip.ZipEntry'),BA=Java.type('byte[]');
var base=new Jar(source),out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-economy.jar'))),iter=base.entries();
while(iter.hasMoreElements()){
 var e=iter.nextElement(),name=String(e.getName());out.putNextEntry(new Entry(name));
 if(replacements[name])out.write(replacements[name]);else{var stream=base.getInputStream(e),b=new BA(8192),n;while((n=stream.read(b))>0)out.write(b,0,n);stream.close();}out.closeEntry();
}
out.close();base.close();print('BUILT work/offline-patches-economy.jar');
