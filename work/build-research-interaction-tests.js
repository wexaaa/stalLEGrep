var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Only the NPC packet sink is mocked. The crashing event handler and event/recipe types are real.
var CP=Java.type('javassist.ClassPool'),Field=Java.type('javassist.CtField'),Method=Java.type('javassist.CtNewMethod'),pool=new CP(true),root=(offlineHome+'/');
pool.appendClassPath('work/research-test-only');pool.appendClassPath('work/item-test-only');pool.appendClassPath('work/spawner-test-only');pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var sink=pool.makeClass('noppes.npcs.NoppesUtilServer');sink.addField(Field.make('public static int packets;',sink));sink.addField(Field.make('public static Object[] payload;',sink));
sink.addMethod(Method.make('public static void sendData(jlas player,noppes.npcs.constants.EnumPacketType type,Object[] data){packets++;payload=data;}',sink));sink.writeFile('work/research-interaction-test-only');
print('BUILT test-only NPC packet sink');
