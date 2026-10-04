var C=Java.type('OfflineCases'),B=Java.type('OfflineBalance'),Player=Java.type('jlas'),Handler=Java.type('swfs'),Item=Java.type('lrhp'),Server=Java.type('ServerPacketHandler'),Open=Java.type('zwqr'),UUID=Java.type('java.util.UUID');
function check(ok,m){if(!ok)throw new Error(m);}
var data=C.catalog();
for each(var type in data.typeList.toArray())for each(var group in type.loot.groups.toArray())for each(var entry in group.entryList.toArray()){
 var id=entry._c();if(id>0 && Item.field_77698_e[id]==null)new Item(id-256);
}
var player=new Player(),handler=new Handler();handler.player=player;
B.add(B.account(player),100);
var request=new Open(UUID.randomUUID(),4);C.handle(request,handler);
check(B.value(B.account(player))===0,'100-ruble case charged wrong amount');check(Server.delivered>0,'Paid case did not deliver rewards');
var rewards=Server.delivered,packets=Server.packets.size();C.handle(request,handler);
check(B.value(B.account(player))===0 && Server.delivered===rewards && Server.packets.size()===packets,'Duplicate request charged or delivered twice');
var field=C.class.getDeclaredField('lastMenuOpen');field.setAccessible(true);field.get(null).remove(player);
C.handle(request,handler);check(B.value(B.account(player))===0 && Server.delivered===rewards,'Insufficient funds still opened a case');
B.handle(new (Java.type('jgvm'))(1000),handler);check(B.value(B.account(player))===1000,'Top-up request failed');
B.handle(new (Java.type('jgvm'))(1000),handler);check(B.value(B.account(player))===1000,'Duplicate top-up credited twice');
field.get(null).remove(player);C.handle(new Open(UUID.randomUUID(),0),handler);check(B.value(B.account(player))===990,'10-ruble case price not charged');
var first=data._a(0),old=first.loot,loot=new (Java.type('mqpx'))(),entries=new (Java.type('java.util.ArrayList'))();
var missingId=32000;Item.field_77698_e[missingId]=null;entries.add(new (Java.type('hscf'))(missingId,1,0,null,0,1));loot.groups.add(new (Java.type('pixj'))('Missing',entries,1));first.loot=loot;
field.get(null).remove(player);rewards=Server.delivered;C.handle(new Open(UUID.randomUUID(),0),handler);
check(B.value(B.account(player))===990 && Server.delivered===rewards,'Failed loot charged player');first.loot=old;
var other=new Player();handler.player=other;C.handle(request,handler);check(B.value(B.account(other))===0 && Server.delivered===rewards,'Another account used host balance');
print('PAYMENT FLOW PASSED: actual request handlers, exact price, duplicate protection, insufficient funds, top-up, loot failure, separate accounts');
