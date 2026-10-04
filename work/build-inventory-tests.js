var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Test-only player/custom-grid adapters. Real qptu, voib, NBT and production helper remain unchanged.
var CP=Java.type('javassist.ClassPool'),Field=Java.type('javassist.CtField'),Method=Java.type('javassist.CtNewMethod'),Ctor=Java.type('javassist.CtNewConstructor');
var root=(offlineHome+'/'),pool=new CP(true);
pool.appendClassPath('work/research-test-only');pool.appendClassPath('work/item-test-only');pool.appendClassPath('work/spawner-test-only');pool.appendClassPath('work/offline-patches-inventory-choice.jar');pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var player=pool.get('jlas');player.addField(Field.make('public qptu field_71071_by;',player));player.writeFile('work/inventory-test-only');
var base=pool.makeClass('hcxt');base.addConstructor(Ctor.defaultConstructor(base));
for each(var src in ['public int capacity=999;','public int syncs;','public java.util.List received=new java.util.ArrayList();'])base.addField(Field.make(src,base));
base.addMethod(Method.make('public java.util.Set appendStackPartially(voib stack){int amount=Math.min(capacity,stack._b);if(amount>0){voib copy=stack._l();copy._b=amount;received.add(copy);stack._b-=amount;capacity-=amount;}return java.util.Collections.emptySet();}',base));
base.addMethod(Method.make('public void detectAndSendChanges(jlas player){syncs++;}',base));base.writeFile('work/inventory-test-only');
var custom=pool.makeClass('mbgk');custom.setSuperclass(base);custom.addConstructor(Ctor.defaultConstructor(custom));custom.writeFile('work/inventory-test-only');
var accessor=pool.makeClass('zyjs');accessor.addField(Field.make('public static mbgk main=new mbgk();',accessor));accessor.addMethod(Method.make('public static mbgk _b(jlas player){return main;}',accessor));accessor.writeFile('work/inventory-test-only');
print('BUILT test-only inventory adapters');
