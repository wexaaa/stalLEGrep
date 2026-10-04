var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Fix the exact server crash in CustomNpcsEvents.invoke, before block activation.
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths');
var CP=Java.type('javassist.ClassPool'),pool=new CP(true),root=(offlineHome+'/'),source=root+'classes/offline-patches.jar';
pool.appendClassPath(source);pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var events=pool.get('noppes.npcs.events.CustomNpcsEvents');
events.getDeclaredMethod('invoke').insertBefore('{if($1==null || $1.entityPlayer==null || $1.entityPlayer.field_70170_p==null)return; if(OfflineResearch.isStation($1.entityPlayer.field_70170_p,$1.x,$1.y,$1.z))return; noppes.npcs.controllers.RecipeController offlineRecipes=noppes.npcs.controllers.RecipeController.instance; if(offlineRecipes==null || offlineRecipes.globalRecipes==null)return;}');
var entryName='noppes/npcs/events/CustomNpcsEvents.class',patched=events.toBytecode();
var Jar=Java.type('java.util.jar.JarFile'),Zip=Java.type('java.util.zip.ZipOutputStream'),Entry=Java.type('java.util.zip.ZipEntry'),BA=Java.type('byte[]');
var base=new Jar(source),out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-research-interaction.jar'))),iter=base.entries(),found=false;
while(iter.hasMoreElements()){var e=iter.nextElement(),name=String(e.getName());out.putNextEntry(new Entry(name));if(name===entryName){out.write(patched);found=true;}else{var stream=base.getInputStream(e),b=new BA(8192),n;while((n=stream.read(b))>0)out.write(b,0,n);stream.close();}out.closeEntry();}
if(!found){out.putNextEntry(new Entry(entryName));out.write(patched);out.closeEntry();}
out.close();base.close();print('BUILT research interaction fix: one CustomNPCs class, all existing patches retained');
