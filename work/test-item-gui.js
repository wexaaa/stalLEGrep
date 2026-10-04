var S=Java.type('OfflineSpawner'),Gui=Java.type('OfflineSpawnerGui'),Base=Java.type('gloomyfolken.mods.core.client.gui.engine.GuiScreenAdvanced'),List=Java.type('gloomyfolken.mods.core.client.gui.engine.component.GuiComponentsList'),Item=Java.type('lrhp'),Client=Java.type('net.minecraft.client.qlfw');
var Unsafe=Java.type('sun.misc.Unsafe'),f=Unsafe.class.getDeclaredField('theUnsafe');f.setAccessible(true);var unsafe=f.get(null);
function check(ok,s){if(!ok)throw new Error(s);}function value(g,n){var f=Gui.class.getDeclaredField(n);f.setAccessible(true);return f.get(g);}
for(var id=100;id<123;id++)new Item(id,'Тест предмет '+id,64);
var g=unsafe.allocateInstance(Gui.class);g.list=new List();for each(var n in ['screenWidth','screenHeight']){var f=Base.class.getDeclaredField(n);f.setAccessible(true);f.setInt(g,n==='screenWidth'?600:500);}
g.func_73866_w_();check(!value(g,'quantity').visible&&!value(g,'quantity').enabled,'Quantity active on entities');
g.choose('@items');check(value(g,'quantity').visible&&value(g,'quantity').enabled,'Quantity hidden on items');check(String(value(g,'quantity').getText())==='1','Default count not 1');check(value(g,'all').size()===23&&value(g,'pages')===3,'Item pagination wrong');
var rows=value(g,'rows');check(rows.size()===17,'Wrong number of tabs/inventory/item/navigation buttons');check(String(rows.get(2).label).indexOf('Предметы')>=0,'Third tab missing');check(!value(g,'stalcraft'),'Default inventory is not ordinary');
check(String(rows.get(3).label).indexOf('[ Обычный')===0&&String(rows.get(4).label)==='STALCRAFT','Inventory buttons missing');
for(var row=5;row<14;row++)check(rows.get(row).y>=rows.get(3).y+26&&rows.get(row).y+26<=rows.get(14).y,'Item rows overlap inventory/navigation');
g.choose('@next');check(value(g,'page')===1,'Next page failed');g.choose('@next');g.choose('@next');check(value(g,'page')===2,'Page bounds failed');
value(g,'search').setText('112');g.func_73876_c();check(value(g,'page')===0&&value(g,'pages')===1&&value(g,'rows').size()===9,'ID search failed');
value(g,'quantity').setText('0');g.choose('item:112:0');check(g.closes===0&&Client._I()._t.sent===null,'Invalid quantity sent/closed');
value(g,'quantity').setText('abc');g.choose('item:112:0');check(g.closes===0&&Client._I()._t.sent===null,'Invalid text sent/closed');
value(g,'quantity').setText('12');g.choose('item:112:0');check(g.closes===1&&String(Client._I()._t.sent)===String(S.command('item:112:0:12:vanilla')),'Selected item/count/inventory not sent');
g.choose('@stalcraft');check(value(g,'stalcraft')&&String(value(g,'search').getText())==='112','Inventory switch reset filter');g.choose('item:112:0');check(String(Client._I()._t.sent)===String(S.command('item:112:0:12:stalcraft')),'STALCRAFT destination not sent');
g.choose('@vanilla');check(!value(g,'stalcraft'),'Switch back to ordinary failed');
g.choose('@entities');check(!value(g,'quantity').visible&&!value(g,'quantity').enabled&&String(value(g,'search').getText())==='','Entity tab did not reset');
var anomalies=new (Java.type('java.util.LinkedHashMap'))();anomalies.put('anomaly:3106','Электра');var all=Gui.class.getDeclaredField('all'),flag=Gui.class.getDeclaredField('anomalies');all.setAccessible(true);flag.setAccessible(true);all.set(g,anomalies);flag.setBoolean(g,true);g.rebuild();check(!value(g,'quantity').visible,'Quantity active on anomalies');g.choose('anomaly:3106');check(String(Client._I()._t.sent)===String(S.command('anomaly:3106')),'Anomaly action altered by quantity');
print('GUI TEST PASSED: three tabs, two inventory destinations, ordinary default, non-overlapping layout, pagination/search, quantity validation, destination commands, entity/anomaly compatibility');
