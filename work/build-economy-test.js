var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Test-only graphical shell. Exercise the actual balance response with no GL.
var CP=Java.type('javassist.ClassPool'),Field=Java.type('javassist.CtField'),Method=Java.type('javassist.CtNewMethod'),Ctor=Java.type('javassist.CtNewConstructor');
var pool=new CP(true),root=(offlineHome+'/');
pool.appendClassPath('work/offline-patches-economy.jar');pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
function shell(name){var c=pool.makeClass(name);c.addConstructor(Ctor.defaultConstructor(c));return c;}
var screen=shell('ywla');screen.writeFile('work/economy-test-only');
var gui=shell('gloomyfolken.mods.core.client.gui.engine.GuiScreenAdvanced');gui.setSuperclass(screen);gui.addField(Field.make('public ywla parentScreen;',gui));gui.writeFile('work/economy-test-only');
var client=shell('net.minecraft.client.qlfw');client.addField(Field.make('public ywla _B;',client));client.addField(Field.make('private static net.minecraft.client.qlfw instance=new net.minecraft.client.qlfw();',client));client.addMethod(Method.make('public static net.minecraft.client.qlfw _I(){ return instance; }',client));client.writeFile('work/economy-test-only');
var dialog=shell('twij');dialog.setSuperclass(gui);dialog.addField(Field.make('public int closes;',dialog));dialog.addMethod(Method.make('public void closeScreen(){ closes++; }',dialog));dialog.writeFile('work/economy-test-only');
var balance=shell('TestBalanceScreen');balance.setSuperclass(gui);balance.addInterface(pool.get('flwp$hrmt'));balance.addField(Field.make('public int balance;',balance));balance.addMethod(Method.make('public void setBalance(int amount){ balance=amount; }',balance));balance.writeFile('work/economy-test-only');
print('Built test-only UI shell; not installed');
// Test-only server shell for the production request/charge/reward flow.
var world=shell('lrzy');world.addField(Field.make('public boolean field_72995_K;',world));world.writeFile('work/economy-test-only');
var entity=shell('gsye');entity.addField(Field.make('public rtag data=new rtag();',entity));entity.addMethod(Method.make('public rtag getEntityData(){ return data; }',entity));entity.writeFile('work/economy-test-only');
var living=shell('xuac');living.setSuperclass(entity);living.addField(Field.make('public lrzy field_70170_p=new lrzy();',living));living.writeFile('work/economy-test-only');
var humanoid=shell('buao');humanoid.setSuperclass(living);humanoid.writeFile('work/economy-test-only');
var player=shell('jlas');player.setSuperclass(humanoid);player.addField(Field.make('public String message;',player));player.addMethod(Method.make('public void func_71035_c(String text){ message=text; }',player));player.writeFile('work/economy-test-only');
var handler=shell('swfs');handler.addField(Field.make('public jlas player;',handler));handler.addMethod(Method.make('public jlas getPlayer(){ return player; }',handler));handler.writeFile('work/economy-test-only');
var packetBase=shell('izjo');packetBase.writeFile('work/economy-test-only');
var packet=shell('xael');packet.setSuperclass(packetBase);packet.addField(Field.make('public gloomyfolken.bundle.common.core.dfaj packet;',packet));packet.addConstructor(Ctor.make('public xael(gloomyfolken.bundle.common.core.dfaj p){ packet=p; }',packet));packet.writeFile('work/economy-test-only');
var server=shell('ServerPacketHandler');server.addField(Field.make('public static int delivered;',server));server.addField(Field.make('public static java.util.List packets=new java.util.ArrayList();',server));server.addMethod(Method.make('public static void giveItemToPlayer(jlas player,voib item){ delivered++; }',server));server.addMethod(Method.make('public static void syncInventory(jlas player){}',server));server.addMethod(Method.make('public static void sendPacketToPlayer(jlas player,izjo packet){ packets.add(((xael)packet).packet); }',server));server.writeFile('work/economy-test-only');
