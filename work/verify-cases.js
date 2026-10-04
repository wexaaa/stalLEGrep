var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Class=Java.type('java.lang.Class');
var CR=Java.type('org.objectweb.asm.ClassReader');
var Jar=Java.type('java.util.jar.JarFile');
var SW=Java.type('java.io.StringWriter');
var PW=Java.type('java.io.PrintWriter');
var loader=Java.type('javassist.ClassPool').class.getClassLoader();
var jar=new Jar('work/offline-patches-cases.jar');
var original=new Jar(arguments.length ? String(arguments[0]) : (offlineHome+'/classes/offline-patches.jar'));
var changed={'OfflineCases.class':true,'stjr.class':true,'gloomyfolken/mods/shop/ShopMod.class':true,'klsl.class':true,'vlml.class':true,'ServerPacketHandler.class':true,'xrsv.class':true};
for(var name in changed) {
 Class.forName(name.replace(/\.class$/,'').replace(/\//g,'.'),false,loader);
 print('VERIFIED '+name);
}
var MD=Java.type('java.security.MessageDigest');
function digest(j,e) {
 var md=MD.getInstance('SHA-256'); var stream=j.getInputStream(e);
 var BA=Java.type('byte[]');var b=new BA(8192);var n;
 while((n=stream.read(b))>0) md.update(b,0,n);
 stream.close();return Java.type('java.util.Arrays').toString(md.digest());
}
var entries=original.entries();var preserved=0;
while(entries.hasMoreElements()) {
 var e=entries.nextElement(); var name=String(e.getName());
 if(changed[name]) continue;
 var other=jar.getJarEntry(name);
 if(other==null || digest(original,e)!==digest(jar,other)) throw new Error('Unrelated entry changed: '+name);
 preserved++;
}
print('PRESERVED '+preserved+' unrelated original entries');
jar.close(); original.close();
