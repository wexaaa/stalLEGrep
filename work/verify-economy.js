var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Class=Java.type('java.lang.Class'),Jar=Java.type('java.util.jar.JarFile'),MD=Java.type('java.security.MessageDigest');
var loader=Java.type('javassist.ClassPool').class.getClassLoader(),base=new Jar(arguments.length?String(arguments[0]):(offlineHome+'/classes/offline-patches.jar')),patched=new Jar('work/offline-patches-economy.jar');
var changed={'OfflineBalance.class':true,'OfflineCases.class':true};
for(var name in changed){Class.forName(name.replace('.class',''),false,loader);print('VERIFIED '+name);}
function hash(j,e){var stream=j.getInputStream(e),md=MD.getInstance('SHA-256'),BA=Java.type('byte[]'),b=new BA(8192),n;while((n=stream.read(b))>0)md.update(b,0,n);stream.close();return Java.type('java.util.Arrays').toString(md.digest());}
var entries=base.entries(),count=0;
while(entries.hasMoreElements()){var e=entries.nextElement(),name=String(e.getName());if(changed[name])continue;var other=patched.getJarEntry(name);if(other===null||hash(base,e)!==hash(patched,other))throw new Error('Unrelated file changed: '+name);count++;}
print('PRESERVED '+count+' other entries');base.close();patched.close();
