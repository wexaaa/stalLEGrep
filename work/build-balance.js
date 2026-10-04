var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Files=Java.type('java.nio.file.Files'),Paths=Java.type('java.nio.file.Paths'),StringJ=Java.type('java.lang.String');
var CP=Java.type('javassist.ClassPool'),Method=Java.type('javassist.CtNewMethod'),Field=Java.type('javassist.CtField');
var root=(offlineHome+'/'),source=arguments.length?String(arguments[0]):root+'classes/offline-patches.jar';
var Jar=Java.type('java.util.jar.JarFile'),base=new Jar(source);
if(base.getJarEntry('OfflineBalance.class')!==null)throw new Error('Already patched: use pre-balance backup');
var pool=new CP(true);pool.appendClassPath(source);pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var helper=pool.makeClass('OfflineBalance');
helper.addField(Field.make('private static java.util.Map lastAddition=java.util.Collections.synchronizedMap(new java.util.WeakHashMap());',helper));
var blocks=String(new StringJ(Files.readAllBytes(Paths.get('work/OfflineBalance.methods.java')),'UTF-8')).split('// METHOD').filter(function(s){return s.trim().length>0;});
for each(var block in blocks){var sig=block.substring(0,block.indexOf('{')),ret=sig.trim().split(/\s+/)[2];helper.addMethod(Method.make(sig+'{'+(ret==='void'?'':ret==='int'?'return 0;':ret==='boolean'?'return false;':'return null;')+'}',helper));}
for each(var block in blocks){var m=Method.make(block,helper);helper.removeMethod(helper.getDeclaredMethod(m.getName()));helper.addMethod(m);print('COMPILED '+m.getName());}
var replacements={'OfflineBalance.class':helper.toBytecode()};
var server=pool.get('ServerPacketHandler');server.getDeclaredMethod('handle').insertBefore('{ if (OfflineBalance.handle($1,$2)) return; }');replacements['ServerPacketHandler.class']=server.toBytecode();
var sender=pool.get('dxne');sender.getDeclaredMethod('_b').insertBefore('{ if ($1 instanceof jgvm || $1 instanceof aniy) { $1.sendToServer(); return; } }');replacements['dxne.class']=sender.toBytecode();
var response=pool.get('flwp');response.getDeclaredMethod('processClient').setBody('{ OfflineBalance.receive(_a); }');replacements['flwp.class']=response.toBytecode();
// Keep the existing dialog and numeric field, changing only the label and callback.
var callback=pool.get('twij$dfak');callback.getDeclaredMethod('_a').setBody('{ Object number=_a.getValue(); if (number instanceof java.lang.Number && ((java.lang.Number)number).longValue()>0L) new jgvm(((java.lang.Number)number).longValue()).sendToServer(); }');replacements['twij$dfak.class']=callback.toBytecode();
var CN=Java.type('org.objectweb.asm.tree.ClassNode'),CR=Java.type('org.objectweb.asm.ClassReader'),CW=Java.type('org.objectweb.asm.ClassWriter'),Ldc=Java.type('org.objectweb.asm.tree.LdcInsnNode');
var gui=pool.get('twij'),node=new CN();new CR(gui.toBytecode()).accept(node,0);var hits=0;
for each(var m in node.methods.toArray())for each(var ins in m.instructions.toArray())if(ins instanceof Ldc && String(ins.cst)==='Оплатить через UNIT'){ins.cst='Добавить локально';hits++;}
if(hits!==1)throw new Error('Expected one payment label');var cw=new CW(0);node.accept(cw);replacements['twij.class']=cw.toByteArray();
var Zip=Java.type('java.util.zip.ZipOutputStream'),Entry=Java.type('java.util.zip.ZipEntry');
var out=new Zip(Files.newOutputStream(Paths.get('work/offline-patches-balance.jar'))),names={},entries=base.entries(),BA=Java.type('byte[]');
while(entries.hasMoreElements()){
 var e=entries.nextElement(),name=String(e.getName());names[name]=true;out.putNextEntry(new Entry(name));
 if(replacements[name])out.write(replacements[name]);else{var stream=base.getInputStream(e),buffer=new BA(8192),n;while((n=stream.read(buffer))>0)out.write(buffer,0,n);stream.close();}out.closeEntry();
}
for(var name in replacements)if(!names[name]){out.putNextEntry(new Entry(name));out.write(replacements[name]);out.closeEntry();}
out.close();base.close();print('BUILT work/offline-patches-balance.jar');
