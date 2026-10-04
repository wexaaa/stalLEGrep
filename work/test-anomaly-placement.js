var S=Java.type('OfflineSpawner'),World=Java.type('lrzy'),Player=Java.type('jlas'),Block=Java.type('txrt');
var Unsafe=Java.type('sun.misc.Unsafe'),uf=Unsafe.class.getDeclaredField('theUnsafe');uf.setAccessible(true);var unsafe=uf.get(null);
var ids=[3101,3102,3103,3104,3132,3106,3107,3134,3119],types=['ycpm','hsbt','tvdh','ccrj','vkim','zwun','owup','iedd','ssac'];
function check(ok,msg){if(!ok)throw new Error(msg);}
for(var i=0;i<ids.length;i++){var T=Java.type(types[i]),block=unsafe.allocateInstance(T.class);block.field_71990_ca=ids[i];if(types[i]!=='ssac'){var f=Java.type('ycqf').class.getDeclaredField('_c');f.setAccessible(true);f.set(block,'Anomaly '+ids[i]);}Block.field_71973_m[ids[i]]=block;}
var portal=unsafe.allocateInstance(Java.type('hsbb').class);Block.field_71973_m[3199]=portal;
check(S.anomalyEntries().size()===9,'Bad anomaly catalog');check(!S.anomalyEntries().containsKey('anomaly:3199'),'Teleport incorrectly allowed');
var player=new Player(),world=new World();player.field_70170_p=world;player.field_70163_u=64;
var throttle=S.class.getDeclaredField('lastSpawn');throttle.setAccessible(true);function send(token){throttle.get(null).remove(player);S.handleChat(S.command(token),player);}
send('anomaly:3106');check(world.writes===1 && world.func_72798_a(0,64,5)===3106 && world.notifications===1,'Electra placement failed');
S.handleChat(S.command('anomaly:3106'),player);check(world.writes===1,'Duplicate not throttled');
send('anomaly:3106');check(world.writes===2 && world.func_72798_a(0,64,5)===3106 && world.func_72798_a(0,64,6)===3106,'Existing anomaly overwritten');
player.field_70165_t=-0.1;send('anomaly:3101');check(world.func_72798_a(-1,64,5)===3101,'Negative coordinate rounding failed');
var writes=world.writes;world.blocked=true;send('anomaly:3104');check(world.writes===writes,'Solid block replaced');world.blocked=false;
world.occupied=true;send('anomaly:3104');check(world.writes===writes,'Spawned on entity');world.occupied=false;
world.loaded=false;send('anomaly:3104');check(world.writes===writes,'Spawned into unloaded chunk');world.loaded=true;
world.accept=false;send('anomaly:3104');check(world.writes===writes,'Rejected placement ignored');world.accept=true;
send('anomaly:3199');send('anomaly:1');send('anomaly:-1');send('anomaly:NaN');check(world.writes===writes,'Bad block accepted');
player.name='friend';send('anomaly:3104');check(world.writes===writes,'Non-owner spawned');player.name='wexa';
world.missingTile=true;send('anomaly:3104');check(world.removals===1 && world.writes===writes+1,'Failed tile was not rolled back');
print('ANOMALY PLACEMENT TEST PASSED: 9 types, safe ground, repeated spawn, negative coordinates, no overwrite, entity/chunk checks, rejected IDs/permissions, tile failure rollback');
