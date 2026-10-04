// Production UI logic with headless component shells; no rendering/game launched.
var R=Java.type('OfflineResearch'),Gui=Java.type('OfflineResearchGui'),Base=Java.type('gloomyfolken.mods.core.client.gui.engine.GuiScreenAdvanced'),Elements=Java.type('gloomyfolken.mods.core.client.gui.engine.component.GuiComponentsList'),Item=Java.type('lrhp'),Artifact=Java.type('bsmb'),Stack=Java.type('voib'),Client=Java.type('net.minecraft.client.qlfw'),Delivery=Java.type('ServerPacketHandler'),S=Java.type('OfflineSpawner');
var Unsafe=Java.type('sun.misc.Unsafe'),f=Unsafe.class.getDeclaredField('theUnsafe');f.setAccessible(true);var unsafe=f.get(null);
function check(v,m){if(!v)throw new Error(m);}function field(g,n){var f=Gui.class.getDeclaredField(n);f.setAccessible(true);return f.get(g);}
var item=unsafe.allocateInstance(Artifact.class);item.field_77779_bT=11000;item.name='Артефакт';Item.field_77698_e[11000]=item;
var items=new (Java.type('java.util.ArrayList'))();for(var i=0;i<23;i++){var stack=new Stack(11000,1,i);stack._a('Артефакт '+i);items.add(stack);}Delivery.inventories.put(Client._I()._t,items);
var g=unsafe.allocateInstance(Gui.class);g.list=new Elements();for each(var n in ['screenWidth','screenHeight']){var f=Base.class.getDeclaredField(n);f.setAccessible(true);f.setInt(g,n==='screenWidth'?600:500);}
g.func_73866_w_();check(field(g,'all').size()===23&&field(g,'pages')===3&&field(g,'rows').size()===13,'Research catalog/pagination wrong');
g.choose('@next');g.choose('@next');g.choose('@next');check(field(g,'page')===2,'Research page not bounded');
field(g,'search').setText('Артефакт 12');g.func_73876_c();check(field(g,'page')===0&&field(g,'pages')===1&&field(g,'rows').size()===4,'Research search wrong');
var action='research:'+R.fingerprint(items.get(12));g.choose(action);check(g.closes===1&&String(Client._I()._t.sent)===String(S.command(action)),'Research request/close wrong');
Delivery.inventories.get(Client._I()._t).clear();g.func_73866_w_();check(field(g,'all').isEmpty()&&field(g,'pages')===1&&field(g,'rows').size()===3,'Empty inventory menu failed');g.choose('@close');check(g.closes===2,'Close button failed');
print('RESEARCH GUI TEST PASSED: owned catalog, search, pages/bounds, research request, close, empty state');
