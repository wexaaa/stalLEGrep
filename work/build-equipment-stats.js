var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths'),Str=Java.type('java.lang.String'),CP=Java.type('javassist.ClassPool'),M=Java.type('javassist.CtNewMethod'),F=Java.type('javassist.CtField'),C=Java.type('javassist.CtNewConstructor');
var root=(offlineHome+'/'),source=root+'classes/offline-patches.jar',pool=new CP(true);pool.appendClassPath(source);pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var pane=pool.makeClass('OfflineEquipmentStatsPane');pane.setSuperclass(pool.get('gloomyfolken.mods.core.client.gui.engine.component.GuiComponent'));
for each(var s in ['private java.util.List rows;','private int offset;','private int lineHeight;','private int contentHeight;','private int grabOffset;','private boolean dragging;'])pane.addField(F.make(s,pane));
var blocks=String(new Str(Files.readAllBytes(Paths.get('work/OfflineEquipmentStatsPane.methods.java')),'UTF-8')).split('// METHOD').filter(function(s){return s.trim().length>0;});
for each(var src in blocks){var sig=src.substring(0,src.indexOf('{')),ret=sig.substring(0,sig.indexOf('(')).trim().split(/\s+/).slice(-2)[0];pane.addMethod(M.make(sig+'{'+(ret==='int'?'return 0;':ret==='void'?'':'return null;')+'}',pane));}
pane.addConstructor(C.make('public OfflineEquipmentStatsPane(scpf screen,gloomyfolken.mods.core.client.gui.engine.Point pos,uyud size){super(screen,pos,size);lineHeight=screen.isSmall()?14:16;renderer=renderer.cloneWithFont(screen.isSmall()?gloomyfolken.mods.core.client.gui.font.ExternalFont.inventory9:gloomyfolken.mods.core.client.gui.font.ExternalFont.inventory10);refresh();}',pane));
for each(var src in blocks){var m=M.make(src,pane);pane.removeMethod(pane.getDeclaredMethod(m.getName()));pane.addMethod(m);}
var screen=pool.get('bbcq');
// Keep native weapon/helmet hints and all equipment slots. Only the body's
// permanent hint in the stats column is replaced, never hover comparison hints.
screen.getDeclaredMethod('_a',[pool.get('zhku'),pool.get('boolean')]).insertBefore('{if(OfflineCharacterStats.enabled() && $1==_d._a()._b())return;}');
screen.getDeclaredMethod('func_73866_w_').insertAfter('{if(OfflineCharacterStats.enabled()){gloomyfolken.mods.core.client.gui.engine.Point left=getLayout()._i();int x=isSmall()?353:435;int y=isSmall()?61:77;addElement(new OfflineEquipmentStatsPane(this,left.add(x,y),new uyud(getLayout()._n().width-x-12,getLayout()._v().height-y-32)));}}');
var replacements={'OfflineEquipmentStatsPane.class':pane.toBytecode(),'bbcq.class':screen.toBytecode()};
var Jar=Java.type('java.util.jar.JarFile'),Zip=Java.type('java.util.zip.ZipOutputStream'),Entry=Java.type('java.util.zip.ZipEntry'),BA=Java.type('byte[]'),base=new Jar(source),out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-equipment-stats.jar'))),iter=base.entries(),seen={};
if(base.getJarEntry('OfflineEquipmentStatsPane.class')!==null)throw new Error('Equipment stats already installed');
while(iter.hasMoreElements()){var e=iter.nextElement(),name=String(e.getName());seen[name]=true;out.putNextEntry(new Entry(name));if(replacements[name])out.write(replacements[name]);else{var stream=base.getInputStream(e),b=new BA(8192),n;while((n=stream.read(b))>0)out.write(b,0,n);stream.close();}out.closeEntry();}
for(var name in replacements)if(!seen[name]){out.putNextEntry(new Entry(name));out.write(replacements[name]);out.closeEntry();}out.close();base.close();print('BUILT work/offline-patches-equipment-stats.jar');
