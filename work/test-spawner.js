var S=Java.type('OfflineSpawner'),World=Java.type('lrzy'),Player=Java.type('jlas'),Mob=Java.type('TestSpawnMob'),Projectile=Java.type('TestSpawnProjectile'),Registry=Java.type('pmie');
var Mutant=Java.type('gloomyfolken.mods.stalker.mobs.entity.EntityMutant'),MutantRegistry=Java.type('gloomyfolken.mods.stalker.mobs.entity.MutantRegistry'),Configs=Java.type('gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper'),Config=Java.type('gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration');
function check(ok,m){if(!ok)throw new Error(m);}
Registry._a.put('TestMob',Mob.class);Registry._a.put('Projectile',Projectile.class);Registry._a.put('Player',Player.class);
MutantRegistry.INSTANCE.getRegisteredMobs().put('dog',Mutant.class);Configs.SERVER.addMobConfig('Снорк тест',new Config());
var entries=S.entries();check(entries.containsKey('entity:TestMob')&&entries.containsKey('base:dog')&&entries.containsKey('mutant:Снорк тест'),'Missing supported entries');check(!entries.containsKey('entity:Projectile')&&!entries.containsKey('entity:Player'),'Unsafe entity listed');
var p=new Player(),w=new World();p.field_70170_p=w;p.field_70163_u=64;
var field=S.class.getDeclaredField('lastSpawn');field.setAccessible(true);function clear(){field.get(null).remove(p);}
check(!S.handleChat('hello',p),'Regular chat intercepted');S.handleChat(S.command('entity:TestMob'),p);check(w.spawned.size()===1,'Mob not spawned');check(w.spawned.get(0).field_70161_v===4 && w.spawned.get(0).field_70163_u>64,'Spawn location incorrect');
S.handleChat(S.command('entity:TestMob'),p);check(w.spawned.size()===1,'Duplicate spawn not throttled');
clear();S.handleChat(S.command('base:dog'),p);check(w.spawned.size()===2 && Configs.SERVER.getMobConfiguration('local_spawn_dog')!==null,'Basic mutant spawn/config failed');
clear();S.handleChat(S.command('mutant:Снорк тест'),p);check(w.spawned.size()===3,'UTF-8 config selection failed');
clear();w.blocked=true;S.handleChat(S.command('entity:TestMob'),p);check(w.spawned.size()===3,'Entity spawned in blocked location');w.blocked=false;
clear();S.handleChat(S.command('entity:Projectile'),p);check(w.spawned.size()===3,'Projectile spawned');
clear();S.handleChat('/localspawn !bad!',p);check(w.spawned.size()===3,'Malformed input spawned entity');
clear();p.name='friend';S.handleChat(S.command('entity:TestMob'),p);check(w.spawned.size()===3,'Unprivileged player spawned entity');
p.op=true;S.handleChat(S.command('entity:TestMob'),p);check(w.spawned.size()===4,'Operator denied');
print('SPAWNER TEST PASSED: supported list, vanilla/base/config spawn, Unicode, placement, throttle, collisions, invalid input, owner/operator permissions');
