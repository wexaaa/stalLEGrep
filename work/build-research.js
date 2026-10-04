var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Preserve all previous fixes; add a research station as workbench metadata 8, not a new block ID.
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths'),Str=Java.type('java.lang.String');
var CP=Java.type('javassist.ClassPool'),Method=Java.type('javassist.CtNewMethod'),Field=Java.type('javassist.CtField'),Ctor=Java.type('javassist.CtNewConstructor');
var root=(offlineHome+'/'),source=arguments.length?String(arguments[0]):root+'classes/offline-patches.jar';
var pool=new CP(true);pool.appendClassPath(source);pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var helper=pool.makeClass('OfflineResearch'),gui=pool.makeClass('OfflineResearchGui'),button=pool.makeClass('OfflineResearchButton'),spawner=pool.get('OfflineSpawner');
for each(var name in ['sessions','lastRequest'])helper.addField(Field.make('private static java.util.Map '+name+'=java.util.Collections.synchronizedMap(new java.util.WeakHashMap());',helper));
gui.setSuperclass(pool.get('gloomyfolken.mods.core.client.gui.engine.GuiScreenAdvanced'));
for each(var src in ['private gloomyfolken.mods.core.client.gui.engine.component.McTextField search;','private java.util.List rows;','private java.util.Map all;','private int page;','private int pages;','private String query;'])gui.addField(Field.make(src,gui));
gui.addConstructor(Ctor.make('public OfflineResearchGui(){super(aovr._a._b(),600,500,null);}',gui));
button.setSuperclass(pool.get('gloomyfolken.mods.core.client.gui.engine.component.McButton'));
button.addField(Field.make('private OfflineResearchGui owner;',button));button.addField(Field.make('private String action;',button));
button.addConstructor(Ctor.make('public OfflineResearchButton(OfflineResearchGui gui,int x,int y,String text,String token){super(gui,x,y,text);owner=gui;action=token;}',button));
var classes={'OfflineResearch':helper,'OfflineResearchGui':gui,'OfflineSpawner':spawner},blocksByClass={},replacements={};
for(var name in classes){var c=classes[name],blocks=String(new Str(Files.readAllBytes(Paths.get('work/'+name+'.methods.java')),'UTF-8')).split('// METHOD').filter(function(s){return s.trim().length>0;});blocksByClass[name]=blocks;
 for each(var src in blocks){var sig=src.substring(0,src.indexOf('{')),parts=sig.substring(0,sig.indexOf('(')).trim().split(/\s+/),methodName=parts.pop(),ret=parts.pop();try{c.getDeclaredMethod(methodName);}catch(missing){c.addMethod(Method.make(sig+'{'+(ret==='void'?'':ret==='boolean'?'return false;':'return null;')+'}',c));}}
}
button.addMethod(Method.make('protected void actionPerformed(){gloomyfolken.mods.core.client.gui.engine.component.McButton.playClickSound();owner.choose(action);}',button));
for(var name in classes){var c=classes[name];for each(var src in blocksByClass[name]){var m=Method.make(src,c);c.removeMethod(c.getDeclaredMethod(m.getName()));c.addMethod(m);print('COMPILED '+name+'.'+m.getName());}replacements[name+'.class']=c.toBytecode();}
replacements['OfflineResearchButton.class']=button.toBytecode();
var itemBlock=pool.get('iibv');
itemBlock.addMethod(Method.make('public int func_77647_b(int metadata){return field_77885_a==58 && metadata==8?8:super.func_77647_b(metadata);}',itemBlock));
itemBlock.addMethod(Method.make('public String func_77628_j(voib stack){if(field_77885_a==58 && stack._f==8)return "Станок исследования артефактов";return super.func_77628_j(stack);}',itemBlock));
replacements['iibv.class']=itemBlock.toBytecode();
var bench=pool.get('nffz');bench.getDeclaredMethod('func_71903_a').insertBefore('{if(OfflineResearch.activate($1,$2,$3,$4,$5))return true;}');
bench.addMethod(Method.make('public int func_71899_b(int metadata){return metadata==8?8:super.func_71899_b(metadata);}',bench));
bench.addMethod(Method.make('public java.util.ArrayList getBlockDropped(lrzy world,int x,int y,int z,int metadata,int fortune){if(metadata==8){java.util.ArrayList result=new java.util.ArrayList();result.add(OfflineResearch.station());return result;}return super.getBlockDropped(world,x,y,z,metadata,fortune);}',bench));
replacements['nffz.class']=bench.toBytecode();
var Jar=Java.type('java.util.jar.JarFile'),Zip=Java.type('java.util.zip.ZipOutputStream'),Entry=Java.type('java.util.zip.ZipEntry'),BA=Java.type('byte[]');
var base=new Jar(source);if(base.getJarEntry('OfflineResearch.class')!==null)throw new Error('Already installed; build from the before-research backup');
var out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-research.jar'))),iter=base.entries(),seen={};
while(iter.hasMoreElements()){var e=iter.nextElement(),name=String(e.getName());seen[name]=true;out.putNextEntry(new Entry(name));if(replacements[name])out.write(replacements[name]);else{var stream=base.getInputStream(e),b=new BA(8192),n;while((n=stream.read(b))>0)out.write(b,0,n);stream.close();}out.closeEntry();}
for(var name in replacements)if(!seen[name]){out.putNextEntry(new Entry(name));out.write(replacements[name]);out.closeEntry();}
out.close();base.close();print('BUILT work/offline-patches-research.jar');
