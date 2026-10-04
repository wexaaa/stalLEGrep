var S=Java.type('OfflineSpawner'),Item=Java.type('lrhp'),Stack=Java.type('voib'),NBT=Java.type('rtag'),Player=Java.type('jlas'),World=Java.type('lrzy'),Delivery=Java.type('ServerPacketHandler');
function check(ok,msg){if(!ok)throw new Error(msg);}
var basic=new Item(100,'Патроны',64),weapon=new Item(101,'§aОружие',1),med=new Item(102,'Аптечка',16),broken=new Item(103,'Broken',64),linkage=new Item(104,'Linkage',64),unnamed=new Item(105,'',64);
basic.variants.add(new Stack(100,100,0));basic.variants.add(new Stack(100,1,0));basic.variants.add(new Stack(100,1,2));
var preset=new Stack(101,1,0);preset._e=new NBT();preset._e._a('weapon_config','preset');var nested=new NBT();nested._a('skin','forest');preset._e._a('attachment',nested);weapon.variants.add(preset);weapon.variants.add(preset._l());
var other=preset._l();other._e._a('weapon_config','second');weapon.variants.add(other);
broken.mode=1;linkage.mode=2;unnamed.mode=3;
var entries=S.itemEntries();check(entries.size()===8,'Missing registry items/variants or duplicate variants: '+entries.size());
check(entries.containsKey('item:100:1'),'Metadata variant missing');check(entries.containsKey('item:101:1'),'Distinct NBT variant missing');
check(String(entries.get('item:101:0')).indexOf('Оружие [101:0]')>=0,'Name/ID missing');check(String(entries.get('item:101:0')).indexOf('§')<0,'Color codes not stripped');check(String(entries.get('item:105:0')).indexOf('fallback_105')>=0,'Name fallback missing');
try{entries.clear();throw new Error('Catalog mutable');}catch(e){check(String(e).indexOf('UnsupportedOperationException')>=0,'Unexpected map error');}
var p=new Player();p.field_70170_p=new World();var last=S.class.getDeclaredField('lastSpawn');last.setAccessible(true);
function reset(){last.get(null).remove(p);Delivery.delivered.clear();Delivery.syncs=0;}
function request(token){return S.handleChat(S.command(token),p);}
reset();request('item:100:1:64');check(Delivery.delivered.size()===1&&Delivery.delivered.get(0)._b===64&&Delivery.delivered.get(0)._f===2,'Metadata/count not delivered');check(Delivery.syncs===1,'Inventory not synchronized once');
request('item:100:0:1');check(Delivery.delivered.size()===1,'Duplicate click not throttled');
reset();request('item:102:0:33');check(Delivery.delivered.size()===3&&Delivery.delivered.get(0)._b===16&&Delivery.delivered.get(2)._b===1,'Stack limit 16 not respected');
reset();request('item:101:0:2');check(Delivery.delivered.size()===2&&Delivery.delivered.get(0)._b===1,'Weapon stack limit not respected');
check(String(Delivery.delivered.get(0)._e._j('weapon_config'))==='preset'&&String(Delivery.delivered.get(1)._e._j('weapon_config'))==='preset','Weapon NBT not preserved');
check(String(Delivery.delivered.get(1)._e._m('attachment')._j('skin'))==='forest','Nested NBT not preserved');
Delivery.delivered.get(0)._e._m('attachment')._a('skin','modified');
reset();request('item:101:0:1');check(String(Delivery.delivered.get(0)._e._m('attachment')._j('skin'))==='forest'&&!Delivery.delivered.get(0)._e._c('test_mutation'),'Cached template mutated by delivery');
check(String(preset._e._m('attachment')._j('skin'))==='forest'&&preset._b===1,'Native variant was mutated');
reset();request('item:101:1:1');check(String(Delivery.delivered.get(0)._e._j('weapon_config'))==='second','Wrong NBT variant issued');
for each(var bad in ['item:100:0:0','item:100:0:65','item:100:0:-1','item:100:0:no','item:999:0:1','item:100:999:1','item:100:0:1:extra']){reset();request(bad);check(Delivery.delivered.isEmpty()&&Delivery.syncs===0,'Invalid token issued items: '+bad);}
reset();p.name='friend';request('item:100:0:1');check(Delivery.delivered.isEmpty(),'Non-owner issued items');p.op=true;request('item:100:0:1');check(Delivery.delivered.size()===1,'Operator denied');
reset();p.field_70170_p.field_72995_K=true;request('item:100:0:1');check(Delivery.delivered.isEmpty(),'Client-side issuance accepted');
print('ITEM TEST PASSED: registry/metadata/NBT variants, deduplication, fallbacks, native deep-copy, count/stack limits, delivery/sync, throttle, invalid requests, permissions, server-only');
