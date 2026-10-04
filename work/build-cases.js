var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Paths=Java.type('java.nio.file.Paths');
var Files=Java.type('java.nio.file.Files');
var StringJ=Java.type('java.lang.String');
var CP=Java.type('javassist.ClassPool');
var Method=Java.type('javassist.CtNewMethod');
var Field=Java.type('javassist.CtField');
var pool=new CP(true);
var root=(offlineHome+'/');
var sourceJar=arguments.length ? String(arguments[0]) : root+'classes/offline-patches.jar';
var sourceCheck=new (Java.type('java.util.jar.JarFile'))(sourceJar);
if(sourceCheck.getJarEntry('OfflineCases.class')!==null) throw new Error('Already patched. Use the saved pre-cases base JAR, not the installed patched file.');
sourceCheck.close();
pool.appendClassPath(sourceJar);
pool.appendClassPath(root+'classes/classes.jar');
pool.appendClassPath(root+'classes/libs.jar');
var helper=pool.makeClass('OfflineCases');
helper.addField(Field.make('private static java.util.Map lastMenuOpen = java.util.Collections.synchronizedMap(new java.util.WeakHashMap());',helper));
var source=String(new StringJ(Files.readAllBytes(Paths.get('work/OfflineCases.methods.java')),'UTF-8'));
var blocks=source.split('// METHOD').filter(function(s){return s.trim().length>0;});
// Declare signatures before compiling bodies to permit forward references.
for each(var block in blocks) {
 var signature=block.substring(0,block.indexOf('{'));
 var ret=signature.trim().split(/\s+/)[2];
 helper.addMethod(Method.make(signature+'{'+(ret==='void'?'':ret==='boolean'?'return false;':'return null;')+'}',helper));
}
for each(var block in blocks) {
 var method=Method.make(block,helper);
 helper.removeMethod(helper.getDeclaredMethod(method.getName()));
 helper.addMethod(method);
 print('COMPILED '+method.getName());
}
var replacements={};
replacements['OfflineCases.class']=helper.toBytecode();
var item=pool.get('stjr');
item.getDeclaredMethod('useItem').setBody('{ OfflineCases.openInventory(this,$1,$2,$3); }');
replacements['stjr.class']=item.toBytecode();
var shop=pool.get('gloomyfolken.mods.shop.ShopMod');
for each(var m in shop.getDeclaredMethods()) if(m.getName()==='_a' && m.getSignature()==='()Lgloomyfolken/bundle/common/cases/CaseData;') m.setBody('{ return OfflineCases.catalog(); }');
replacements['gloomyfolken/mods/shop/ShopMod.class']=shop.toBytecode();
var buffer=pool.get('klsl');
for each(var m in buffer.getDeclaredMethods()) if(m.getName()==='_b' && m.getSignature()==='(I)Ljava/lang/Integer;') m.setBody('{ return null; }');
replacements['klsl.class']=buffer.toBytecode();
var tool=pool.get('vlml');
tool.getDeclaredMethod('_c').setBody('{ return net.minecraft.client.qlfw._I()._t != null && !OfflineCases.catalog().typeList.isEmpty(); }');
replacements['vlml.class']=tool.toBytecode();
// Stop at the last actual reward, not at the number of configured loot groups.
// Closing must not reset the roulette or accept another queued click.
var screen=pool.get('xrsv');
screen.addField(Field.make('private boolean offlineCasesFinished;',screen));
screen.getDeclaredMethod('_f').setBody('{ if (offlineCasesFinished) return; int count = Math.min(_k == null ? 0 : _k.length, _j._d().size()); if (_m >= count-1) { offlineCasesFinished=true; closeScreen(); return; } _m++; _g(); }');
screen.getDeclaredMethod('_l').insertBefore('{ if (offlineCasesFinished) return; }');
screen.getDeclaredMethod('func_73863_a').insertBefore('{ if (offlineCasesFinished) return; }');
replacements['xrsv.class']=screen.toBytecode();
var server=pool.get('ServerPacketHandler');
server.getDeclaredMethod('handle').insertBefore('{ if (OfflineCases.handle($1,$2)) return; }');
var serverBytes=server.toBytecode();
// The existing inventory handler owns acknowledgments and synchronization; replace only the lootbox dispatch.
var CN=Java.type('org.objectweb.asm.tree.ClassNode');
var CR=Java.type('org.objectweb.asm.ClassReader');
var CW=Java.type('org.objectweb.asm.ClassWriter');
var Var=Java.type('org.objectweb.asm.tree.VarInsnNode');
var Call=Java.type('org.objectweb.asm.tree.MethodInsnNode');
var cn=new CN(); new CR(serverBytes).accept(cn,0);
var hits=0;
for each(var m in cn.methods.toArray()) if(m.name==='handleInventoryPacket') {
 for each(var i in m.instructions.toArray()) if(i instanceof Call && i.owner==='voib' && i.name==='_a' && i.desc==='(Llrzy;Ljlas;)Lvoib;') {
  m.instructions.insertBefore(i,new Var(25,6));
  m.instructions.insertBefore(i,new Var(25,8));
  m.instructions.set(i,new Call(184,'OfflineCases','useStack','(Lvoib;Llrzy;Ljlas;Ldhmd;Lhtyp;)Lvoib;',false));
  m.maxStack+=2; hits++;
 }
}
if(hits!==1) throw new Error('Expected one inventory dispatch; found '+hits);
var writer=new CW(1); cn.accept(writer);
replacements['ServerPacketHandler.class']=writer.toByteArray();
var Jar=Java.type('java.util.jar.JarFile');
var Zip=Java.type('java.util.zip.ZipOutputStream');
var Entry=Java.type('java.util.zip.ZipEntry');
var jar=new Jar(sourceJar);
var out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-cases.jar')));
var names={};
var e=jar.entries();
while(e.hasMoreElements()) {
 var entry=e.nextElement(); var name=String(entry.getName()); names[name]=true;
 out.putNextEntry(new Entry(name));
 if(replacements[name]) out.write(replacements[name]);
 else {var input=jar.getInputStream(entry); var ByteArray=Java.type('byte[]'); var bytes=new ByteArray(8192); var count; while((count=input.read(bytes))>0) out.write(bytes,0,count); input.close();}
 out.closeEntry();
}
for(var name in replacements) if(!names[name]) {out.putNextEntry(new Entry(name));out.write(replacements[name]);out.closeEntry();}
out.close();jar.close();
for(var name in replacements) {
 var path=Paths.get('work/case-classes/'+name); Files.createDirectories(path.getParent()); Files.write(path,replacements[name]);
}
print('BUILT work/offline-patches-cases.jar; replaced '+Object.keys(replacements).join(', '));
