var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Extend the existing test world. These stand-ins are never installed.
var CP=Java.type('javassist.ClassPool'),Field=Java.type('javassist.CtField'),Method=Java.type('javassist.CtNewMethod');
var root=(offlineHome+'/'),pool=new CP(true);pool.appendClassPath('work/spawner-test-only');pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var world=pool.get('lrzy');
for each(var src in ['public java.util.Map blocks=new java.util.HashMap();','public boolean loaded=true;','public boolean occupied;','public boolean missingTile;','public int writes;','public int notifications;','public int removals;'])world.addField(Field.make(src,world));
for each(var src in [
'public boolean func_72899_e(int x,int y,int z){return loaded;}',
'public int func_72798_a(int x,int y,int z){Integer id=(Integer)blocks.get(x+","+y+","+z);return id!=null?id.intValue():(blocked||y<=63?1:0);}',
'public boolean func_72809_s(int x,int y,int z){return y==63;}',
'public java.util.List func_72872_a(Class type,net.minecraft.util.dfak box){java.util.List list=new java.util.ArrayList();if(occupied)list.add(new Object());return list;}',
'public boolean func_72832_d(int x,int y,int z,int id,int metadata,int flags){if(!accept)return false;if(func_72798_a(x,y,z)!=0)throw new IllegalStateException("Overwrite attempted");blocks.put(x+","+y+","+z,Integer.valueOf(id));writes++;return true;}',
'public vous func_72796_p(int x,int y,int z){return missingTile?null:new vous();}',
'public void func_72902_n(int x,int y,int z){notifications++;}',
'public boolean func_94571_i(int x,int y,int z){blocks.remove(x+","+y+","+z);removals++;return true;}'
])world.addMethod(Method.make(src,world));world.writeFile('work/anomaly-world-test-only');
var box=pool.get('net.minecraft.util.dfak');box.addMethod(Method.make('public static net.minecraft.util.dfak _a(double a,double b,double c,double d,double e,double f){return new net.minecraft.util.dfak();}',box));box.writeFile('work/anomaly-world-test-only');
print('Built isolated anomaly placement world');
