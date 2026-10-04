var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Incremental update: only two classes change; all existing fixes are preserved.
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths'),Str=Java.type('java.lang.String');
var CP=Java.type('javassist.ClassPool'),Method=Java.type('javassist.CtNewMethod'),Field=Java.type('javassist.CtField');
var root=(offlineHome+'/'),source=root+'classes/offline-patches.jar';
var pool=new CP(true);pool.appendClassPath(source);pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var helper=pool.get('OfflineSpawner'),gui=pool.get('OfflineSpawnerGui');
function addField(c,name,src){try{c.getDeclaredField(name);}catch(missing){c.addField(Field.make(src,c));}}
addField(helper,'itemTemplates','private static java.util.Map itemTemplates;');
addField(helper,'itemLabels','private static java.util.Map itemLabels;');
addField(gui,'items','private boolean items;');
addField(gui,'stalcraft','private boolean stalcraft;');
addField(gui,'quantity','private gloomyfolken.mods.core.client.gui.engine.component.McTextField quantity;');
var classes={'OfflineSpawner':helper,'OfflineSpawnerGui':gui},replacements={};
for(var name in classes){var c=classes[name];var blocks=String(new Str(Files.readAllBytes(Paths.get('work/'+name+'.methods.java')),'UTF-8')).split('// METHOD').filter(function(s){return s.trim().length>0;});
 for each(var src in blocks){var sig=src.substring(0,src.indexOf('{')),parts=sig.substring(0,sig.indexOf('(')).trim().split(/\s+/),methodName=parts.pop(),ret=parts.pop();try{c.getDeclaredMethod(methodName);}catch(missing){c.addMethod(Method.make(sig+'{'+(ret==='void'?'':ret==='boolean'?'return false;':'return null;')+'}',c));}}
 for each(var src in blocks){var m=Method.make(src,c);c.removeMethod(c.getDeclaredMethod(m.getName()));c.addMethod(m);print('COMPILED '+name+'.'+m.getName());}
 replacements[name+'.class']=c.toBytecode();
}
var Jar=Java.type('java.util.jar.JarFile'),Zip=Java.type('java.util.zip.ZipOutputStream'),Entry=Java.type('java.util.zip.ZipEntry'),BA=Java.type('byte[]');
var base=new Jar(source),out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-items.jar'))),iter=base.entries();
while(iter.hasMoreElements()){var e=iter.nextElement(),name=String(e.getName());out.putNextEntry(new Entry(name));if(replacements[name])out.write(replacements[name]);else{var stream=base.getInputStream(e),b=new BA(8192),n;while((n=stream.read(b))>0)out.write(b,0,n);stream.close();}out.closeEntry();}
out.close();base.close();print('BUILT work/offline-patches-items.jar');
