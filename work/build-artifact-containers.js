var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths'),Str=Java.type('java.lang.String');
var CP=Java.type('javassist.ClassPool'),Method=Java.type('javassist.CtNewMethod'),Field=Java.type('javassist.CtField');
var root=(offlineHome+'/'),source=root+'classes/offline-patches.jar',pool=new CP(true);
pool.appendClassPath(source);pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var helper=pool.makeClass('OfflineArtifactContainers');helper.addField(Field.make('private static java.util.Map processed=java.util.Collections.synchronizedMap(new java.util.WeakHashMap());',helper));
var blocks=String(new Str(Files.readAllBytes(Paths.get('work/OfflineArtifactContainers.methods.java')),'UTF-8')).split('// METHOD').filter(function(s){return s.trim().length>0;});
for each(var src in blocks){var sig=src.substring(0,src.indexOf('{')),parts=sig.substring(0,sig.indexOf('(')).trim().split(/\s+/),name=parts.pop(),ret=parts.pop();helper.addMethod(Method.make(sig+'{'+(ret==='void'?'':ret==='boolean'?'return false;':'return null;')+'}',helper));}
for each(var src in blocks){var m=Method.make(src,helper);helper.removeMethod(helper.getDeclaredMethod(m.getName()));helper.addMethod(m);print('COMPILED '+m.getName());}
var handler=pool.get('ServerPacketHandler');handler.getDeclaredMethod('handleInventoryPacket').insertBefore('{if($1 instanceof kldc){OfflineArtifactContainers.handle((kldc)$1,$2);return;}}');
var replacements={'OfflineArtifactContainers.class':helper.toBytecode(),'ServerPacketHandler.class':handler.toBytecode()};
var Jar=Java.type('java.util.jar.JarFile'),Zip=Java.type('java.util.zip.ZipOutputStream'),Entry=Java.type('java.util.zip.ZipEntry'),BA=Java.type('byte[]');
var base=new Jar(source),out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-artifact-containers.jar'))),iter=base.entries(),seen={};
while(iter.hasMoreElements()){var e=iter.nextElement(),name=String(e.getName());seen[name]=true;out.putNextEntry(new Entry(name));if(replacements[name])out.write(replacements[name]);else{var stream=base.getInputStream(e),b=new BA(8192),n;while((n=stream.read(b))>0)out.write(b,0,n);stream.close();}out.closeEntry();}
for(var name in replacements)if(!seen[name]){out.putNextEntry(new Entry(name));out.write(replacements[name]);out.closeEntry();}
out.close();base.close();print('BUILT work/offline-patches-artifact-containers.jar');
