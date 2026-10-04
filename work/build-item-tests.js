var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Test-only item registry and delivery spy; actual voib/NBT and production helper remain unchanged.
var CP=Java.type('javassist.ClassPool'),Field=Java.type('javassist.CtField'),Method=Java.type('javassist.CtNewMethod'),Ctor=Java.type('javassist.CtNewConstructor');
var pool=new CP(true),root=(offlineHome+'/');pool.appendClassPath('work/spawner-test-only');pool.appendClassPath('work/offline-patches-items.jar');pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
function field(c,src){c.addField(Field.make(src,c));}function method(c,src){c.addMethod(Method.make(src,c));}function save(c){c.writeFile('work/item-test-only');}
var item=pool.makeClass('lrhp');
for each(var src in ['public static lrhp[] field_77698_e=new lrhp[32768];','public int field_77779_bT;','public int limit=64;','public String name;','public java.util.List variants=new java.util.ArrayList();','public int mode;'])field(item,src);
item.addConstructor(Ctor.make('public lrhp(int id,String label,int max){field_77779_bT=id;name=label;limit=max;field_77698_e[id]=this;}',item));
method(item,'public void func_77633_a(int id,djed tab,java.util.List result){if(mode==1)throw new IllegalStateException("unsupported");if(mode==2)throw new NoClassDefFoundError("client-only");result.addAll(variants);}');
method(item,'public djed func_77640_w(){return null;}');
method(item,'public String func_77658_a(){return "fallback_"+field_77779_bT;}');
method(item,'public String func_77628_j(voib stack){if(mode==3)throw new IllegalStateException("unnamed");return name;}');
method(item,'public int getItemStackLimit(voib stack){return limit;}');save(item);
var hooks=pool.makeClass('gloomyfolken.mods.asm.GloomyHooks');method(hooks,'public static String getDisplayName(voib stack,String name){return name;}');save(hooks);
var delivery=pool.makeClass('ServerPacketHandler');field(delivery,'public static java.util.List delivered=new java.util.ArrayList();');field(delivery,'public static int syncs;');
method(delivery,'public static void giveItemToPlayer(jlas player,voib stack){delivered.add(stack._l());if(stack._e!=null)stack._e._a("test_mutation","changed");stack._b=0;}');
method(delivery,'public static void syncInventory(jlas player){syncs++;}');save(delivery);
print('BUILT TEST-ONLY item registry/delivery spy');
