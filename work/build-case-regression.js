var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Headless fixtures only. Copy the production button methods without OpenGL.
var CP=Java.type('javassist.ClassPool'),Field=Java.type('javassist.CtField');
var Method=Java.type('javassist.CtNewMethod'),Ctor=Java.type('javassist.CtNewConstructor');
var pool=new CP(true),root=(offlineHome+'/');
pool.appendClassPath('work/offline-patches-cases.jar');
pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var original=pool.get('xrsv'),test=pool.makeClass('CaseScreenRegression');
var base=pool.makeClass('CaseScreenBase');
base.addConstructor(Ctor.defaultConstructor(base));
base.addMethod(Method.make('public void closeScreen(){}',base));
base.writeFile('work/test-only');test.setSuperclass(base);
for each(var src in ['public voib[] _k;','public gloomyfolken.bundle.common.cases.CaseType _j;',
 'public int _m;','public boolean _r;','public boolean _s;',
 'public boolean offlineCasesFinished;','public int closes;','public int resets;','public int actions;']) test.addField(Field.make(src,test));
test.addConstructor(Ctor.defaultConstructor(test));
for each(var src in ['public void closeScreen(){ closes++; }','private void _g(){ resets++; _r=false; _s=false; }',
 'private void _d(){ actions++; }','private void _e(){ actions++; }']) test.addMethod(Method.make(src,test));
test.addMethod(Method.copy(original.getDeclaredMethod('_f'),test,null));
test.addMethod(Method.copy(original.getDeclaredMethod('_l'),test,null));
test.addMethod(Method.make('public void accept(){ _f(); }',test));
test.addMethod(Method.make('public void click(){ _l(); }',test));
test.writeFile('work/test-only');
// Display-name hooks require a running Forge client. Replace only that call
// in a TEST-ONLY helper copy, keeping the production preview logic unchanged.
var CN=Java.type('org.objectweb.asm.tree.ClassNode'),CR=Java.type('org.objectweb.asm.ClassReader');
var CW=Java.type('org.objectweb.asm.ClassWriter'),Call=Java.type('org.objectweb.asm.tree.MethodInsnNode');
var Insn=Java.type('org.objectweb.asm.tree.InsnNode'),Ldc=Java.type('org.objectweb.asm.tree.LdcInsnNode');
var node=new CN();new CR(pool.get('OfflineCases').toBytecode()).accept(node,0);
var hits=0;
for each(var m in node.methods.toArray())if(m.name==='preview')for each(var i in m.instructions.toArray()){
 if(i instanceof Call && i.owner==='voib' && i.name==='_s'){
  m.instructions.insertBefore(i,new Insn(87));m.instructions.set(i,new Ldc('Test case'));hits++;
 }
}
if(hits!==1)throw new Error('Expected one display-name hook');
var writer=new CW(1);node.accept(writer);
Java.type('java.nio.file.Files').write(Java.type('java.nio.file.Paths').get('work/test-only/OfflineCases.class'),writer.toByteArray());
print('Built headless regression fixtures; not included in installed JAR');
