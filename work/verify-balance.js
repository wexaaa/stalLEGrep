var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Class=Java.type('java.lang.Class'),Jar=Java.type('java.util.jar.JarFile'),MD=Java.type('java.security.MessageDigest');
var loader=Java.type('javassist.ClassPool').class.getClassLoader();
var changed={'OfflineBalance.class':true,'ServerPacketHandler.class':true,'dxne.class':true,'flwp.class':true,'twij.class':true,'twij$dfak.class':true};
for(var name in changed){Class.forName(name.replace(/\.class$/,'').replace(/\//g,'.'),false,loader);print('VERIFIED '+name);}
var base=new Jar(arguments.length?String(arguments[0]):(offlineHome+'/classes/offline-patches.jar'));
var patched=new Jar('work/offline-patches-balance.jar'),entries=base.entries(),preserved=0;
function hash(j,e){var stream=j.getInputStream(e),md=MD.getInstance('SHA-256'),BA=Java.type('byte[]'),b=new BA(8192),n;while((n=stream.read(b))>0)md.update(b,0,n);stream.close();return Java.type('java.util.Arrays').toString(md.digest());}
while(entries.hasMoreElements()){var e=entries.nextElement(),name=String(e.getName());if(changed[name])continue;var other=patched.getJarEntry(name);if(other===null||hash(base,e)!==hash(patched,other))throw new Error('Unrelated patch changed: '+name);preserved++;}
print('PRESERVED '+preserved+' unrelated entries, including all case-crash fixes');base.close();patched.close();
