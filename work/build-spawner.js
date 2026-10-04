var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths'),Str=Java.type('java.lang.String');
var CP=Java.type('javassist.ClassPool'),Method=Java.type('javassist.CtNewMethod'),Field=Java.type('javassist.CtField'),Ctor=Java.type('javassist.CtNewConstructor');
var root=(offlineHome+'/'),source=arguments.length?String(arguments[0]):root+'classes/offline-patches.jar';
var pool=new CP(true);pool.appendClassPath(source);pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var helper=pool.makeClass('OfflineSpawner'),gui=pool.makeClass('OfflineSpawnerGui'),button=pool.makeClass('OfflineSpawnButton');
helper.addField(Field.make('private static boolean keyHeld;',helper));helper.addField(Field.make('private static java.util.Map lastSpawn=java.util.Collections.synchronizedMap(new java.util.WeakHashMap());',helper));
helper.addField(Field.make('private static java.util.Map itemTemplates;',helper));helper.addField(Field.make('private static java.util.Map itemLabels;',helper));
gui.setSuperclass(pool.get('gloomyfolken.mods.core.client.gui.engine.GuiScreenAdvanced'));
for each(var src in ['private gloomyfolken.mods.core.client.gui.engine.component.McTextField search;','private java.util.List rows;','private java.util.Map all;','private int page;','private int pages;','private String query;','private boolean anomalies;'])gui.addField(Field.make(src,gui));
gui.addField(Field.make('private boolean items;',gui));gui.addField(Field.make('private gloomyfolken.mods.core.client.gui.engine.component.McTextField quantity;',gui));
gui.addField(Field.make('private boolean stalcraft;',gui));
gui.addConstructor(Ctor.make('public OfflineSpawnerGui(){ super(aovr._a._b(),600,500,null); }',gui));
button.setSuperclass(pool.get('gloomyfolken.mods.core.client.gui.engine.component.McButton'));
button.addField(Field.make('private OfflineSpawnerGui owner;',button));button.addField(Field.make('private String action;',button));
button.addConstructor(Ctor.make('public OfflineSpawnButton(OfflineSpawnerGui screen,int x,int y,String label,String token){ super(screen,x,y,label); owner=screen; action=token; }',button));
var blocksByClass={},classes={'OfflineSpawner':helper,'OfflineSpawnerGui':gui};
for(var name in classes){var c=classes[name],blocks=String(new Str(Files.readAllBytes(Paths.get('work/'+name+'.methods.java')),'UTF-8')).split('// METHOD').filter(function(s){return s.trim().length>0;});blocksByClass[name]=blocks;
 for each(var src in blocks){var sig=src.substring(0,src.indexOf('{')),parts=sig.substring(0,sig.indexOf('(')).trim().split(/\s+/),ret=parts[parts.length-2];c.addMethod(Method.make(sig+'{'+(ret==='void'?'':ret==='boolean'?'return false;':'return null;')+'}',c));}
}
button.addMethod(Method.make('protected void actionPerformed(){ gloomyfolken.mods.core.client.gui.engine.component.McButton.playClickSound(); owner.choose(action); }',button));
for(var name in classes){var c=classes[name];for each(var src in blocksByClass[name]){var m=Method.make(src,c);c.removeMethod(c.getDeclaredMethod(m.getName()));c.addMethod(m);print('COMPILED '+name+'.'+m.getName());}}
var replacements={'OfflineSpawner.class':helper.toBytecode(),'OfflineSpawnerGui.class':gui.toBytecode(),'OfflineSpawnButton.class':button.toBytecode()};
var server=pool.get('pmyd');server.getDeclaredMethod('func_72481_a').insertBefore('{ if (OfflineSpawner.handleChat($1._a,field_72574_e)) return; }');replacements['pmyd.class']=server.toBytecode();
var hook=pool.get('local.stalcraft.OfflineHook');hook.getDeclaredMethod('tick').insertBefore('{ OfflineSpawner.clientTick($1); }');replacements['local/stalcraft/OfflineHook.class']=hook.toBytecode();
var Jar=Java.type('java.util.jar.JarFile'),Zip=Java.type('java.util.zip.ZipOutputStream'),Entry=Java.type('java.util.zip.ZipEntry'),BA=Java.type('byte[]');
var base=new Jar(source);if(base.getJarEntry('OfflineSpawner.class')!==null)throw new Error('Already patched; use backup');
var out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-spawner.jar'))),iter=base.entries(),names={};
while(iter.hasMoreElements()){var e=iter.nextElement(),name=String(e.getName());names[name]=true;out.putNextEntry(new Entry(name));if(replacements[name])out.write(replacements[name]);else{var stream=base.getInputStream(e),b=new BA(8192),n;while((n=stream.read(b))>0)out.write(b,0,n);stream.close();}out.closeEntry();}
for(var name in replacements)if(!names[name]){out.putNextEntry(new Entry(name));out.write(replacements[name]);out.closeEntry();}
out.close();base.close();print('BUILT work/offline-patches-spawner.jar');
