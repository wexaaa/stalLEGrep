var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Test-only: isolate the config registry from Minecraft globals and suppress world-dependent attribute setup.
// Actual production setConfiguration, spawn-data writer/reader, serializer, skins and damage guard remain unchanged.
var CP=Java.type('javassist.ClassPool'),Field=Java.type('javassist.CtField'),Method=Java.type('javassist.CtNewMethod'),Ctor=Java.type('javassist.CtNewConstructor');
var pool=new CP(true),root=(offlineHome+'/');pool.appendClassPath('work/offline-patches-spawner-fixed.jar');pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var helper=pool.makeClass('gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper');helper.addConstructor(Ctor.defaultConstructor(helper));
helper.addField(Field.make('public static gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper CLIENT=new gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper();',helper));
helper.addField(Field.make('private java.util.Map configs=new java.util.HashMap();',helper));
helper.addMethod(Method.make('public gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration getMobConfiguration(String name){return (gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration)configs.get(name);}',helper));
helper.addMethod(Method.make('public void addMobConfig(String name,gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration config){configs.put(name,config);}',helper));
helper.writeFile('work/spawn-packet-test-only');
var mutant=pool.get('gloomyfolken.mods.stalker.mobs.entity.EntityMutant');mutant.getDeclaredMethod('applyConfiguration').setBody('{}');mutant.writeFile('work/spawn-packet-test-only');
print('Built isolated packet test support; never install these classes');
