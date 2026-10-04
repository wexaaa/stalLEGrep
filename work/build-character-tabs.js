var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths'),Str=Java.type('java.lang.String'),CP=Java.type('javassist.ClassPool'),M=Java.type('javassist.CtNewMethod');
var root=(offlineHome+'/'),source=root+'classes/offline-patches.jar',pool=new CP(true);pool.appendClassPath(source);pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var helper=pool.makeClass('OfflineCharacterTabs');
var blocks=String(new Str(Files.readAllBytes(Paths.get('work/OfflineCharacterTabs.methods.java')),'UTF-8')).split('// METHOD').filter(function(s){return s.trim().length>0;});
for each(var s in blocks)helper.addMethod(M.make(s,helper));
var server=pool.get('ServerPacketHandler');
server.getDeclaredMethod('handle').insertBefore('{if(OfflineCharacterTabs.handle($1,$2))return;}');
server.getDeclaredMethod('handleEntityAction').insertBefore('{if($1!=null && $1._b==7 && OfflineCharacterTabs.handle(new hdci(),$2))return;}');
server.getDeclaredMethod('syncInventory').insertAfter('{OfflineCharacterTabs.syncActive($1);}');
var charPacket=pool.get('xsri'),equipPacket=pool.get('hdci');
// The existing selector changes the label before acknowledgement. Also reset it
// when inventory is reopened with I, so the label always matches the actual GUI.
charPacket.getDeclaredMethod('createClientInventoryGui').insertBefore('{if(OfflineCharacterStats.enabled()){OfflineCharacterTabs.closeClientCharacter($1);fnmp._b(1);}}');
equipPacket.getDeclaredMethod('createClientInventoryGui').insertBefore('{if(OfflineCharacterStats.enabled()){OfflineCharacterTabs.closeClientCharacter($1);fnmp._b(0);}}');
var replacements={'OfflineCharacterTabs.class':helper.toBytecode(),'ServerPacketHandler.class':server.toBytecode(),'xsri.class':charPacket.toBytecode(),'hdci.class':equipPacket.toBytecode()};
var Jar=Java.type('java.util.jar.JarFile'),Zip=Java.type('java.util.zip.ZipOutputStream'),Entry=Java.type('java.util.zip.ZipEntry'),BA=Java.type('byte[]'),base=new Jar(source),out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-character-tabs.jar'))),iter=base.entries(),seen={};
if(base.getJarEntry('OfflineCharacterTabs.class')!==null)throw new Error('Tabs fix already installed');
while(iter.hasMoreElements()){var e=iter.nextElement(),name=String(e.getName());seen[name]=true;out.putNextEntry(new Entry(name));if(replacements[name])out.write(replacements[name]);else{var stream=base.getInputStream(e),b=new BA(8192),n;while((n=stream.read(b))>0)out.write(b,0,n);stream.close();}out.closeEntry();}
for(var name in replacements)if(!seen[name]){out.putNextEntry(new Entry(name));out.write(replacements[name]);out.closeEntry();}out.close();base.close();print('BUILT work/offline-patches-character-tabs.jar');
