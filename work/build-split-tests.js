var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Extend isolated inventory adapters; item stack/NBT, merge predicate and packet serialization remain native.
var CP=Java.type('javassist.ClassPool'),Field=Java.type('javassist.CtField'),Method=Java.type('javassist.CtNewMethod'),pool=new CP(true),root=(offlineHome+'/');
pool.appendClassPath('work/container-test-only');pool.appendClassPath('work/research-test-only');pool.appendClassPath('work/item-test-only');pool.appendClassPath('work/spawner-test-only');pool.appendClassPath('work/offline-patches-inventory-split.jar');pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var s=pool.get('zhku');s.addField(Field.make('public int limit=64;',s));s.addField(Field.make('public boolean noTake;',s));s.addField(Field.make('public boolean noPut;',s));s.getDeclaredMethod('getMaxStackSize').setBody('{return Math.min(limit,$1._d());}');s.writeFile('work/split-test-only');
var v=pool.get('dhmd');v.getDeclaredMethod('canPlayerTakeStacks').setBody('{return !$1.deny && !$1.noTake;}');v.getDeclaredMethod('canPlayerPutStack').setBody('{return !$1.deny && !$1.noPut;}');v.writeFile('work/split-test-only');
var item=pool.get('lrhp');item.addMethod(Method.make('public boolean isDamaged(voib s){return false;}',item));item.writeFile('work/split-test-only');
print('BUILT split-only inventory permission/limit adapters');
