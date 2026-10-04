var Events=Java.type('noppes.npcs.events.CustomNpcsEvents'),Recipes=Java.type('noppes.npcs.controllers.RecipeController'),Event=Java.type('net.minecraftforge.event.entity.player.PlayerInteractEvent'),Action=Java.type('net.minecraftforge.event.entity.player.PlayerInteractEvent$Action'),Result=Java.type('net.minecraftforge.event.Event$Result'),Sink=Java.type('noppes.npcs.NoppesUtilServer');
var World=Java.type('lrzy'),Player=Java.type('jlas'),Block=Java.type('txrt'),Bench=Java.type('nffz'),R=Java.type('OfflineResearch'),Stack=Java.type('voib');
var Unsafe=Java.type('sun.misc.Unsafe'),f=Unsafe.class.getDeclaredField('theUnsafe');f.setAccessible(true);var unsafe=f.get(null);
function check(v,m){if(!v)throw new Error(m);}
var handler=new Events(),p=new Player(),w=new World();p.field_70170_p=w;
var bench=unsafe.allocateInstance(Bench.class);var idField=Block.class.getDeclaredField('field_71990_ca');unsafe.putInt(bench,unsafe.objectFieldOffset(idField),58);Block.field_71973_m[58]=bench;var benchField=Block.class.getDeclaredField('field_72060_ay');unsafe.putObject(unsafe.staticFieldBase(benchField),unsafe.staticFieldOffset(benchField),bench);
check(benchField.get(null)!==null&&benchField.get(null).field_71990_ca===58,'Test native workbench constant missing');
w.blocks.put('0,64,0',Java.type('java.lang.Integer').valueOf(58));w.metadata.put('0,64,0',Java.type('java.lang.Integer').valueOf(8));
function event(){return new Event(p,Action.RIGHT_CLICK_BLOCK,0,64,0,1);}
Recipes.instance=null;
if(arguments.length && String(arguments[0])==='reproduce') {
 try{handler.invoke(event());throw new Error('Original crash not reproduced');}catch(e){check(String(e).indexOf('NullPointerException')>=0&&e.getStackTrace()[0].getLineNumber()===158,'Unexpected original crash: '+e);}
 print('REPRODUCED exact CustomNpcsEvents.invoke NullPointerException with RecipeController.instance=null');
} else {
 var e=event();handler.invoke(e);check(!e.isCanceled()&&e.useBlock===Result.DEFAULT&&Sink.packets===0,'Station event canceled or NPC recipe packet emitted');
 check(bench.func_71903_a(w,0,64,0,p,1,0,0,0)&&p.craftingOpened===0,'Server station activation did not follow Forge event');
 var sessions=R.class.getDeclaredField('sessions');sessions.setAccessible(true);check(sessions.get(null).containsKey(p),'Station did not register research session');
 var recipes=unsafe.allocateInstance(Recipes.class);Recipes.instance=recipes;recipes.globalRecipes=null;handler.invoke(event());check(Sink.packets===0,'Station accessed null recipes');
 recipes.globalRecipes=new (Java.type('java.util.HashMap'))();handler.invoke(event());check(Sink.packets===0,'Station incorrectly synchronizes crafting recipes');
 // Regular workbenches still synchronize recipes when available and open native crafting.
 w.metadata.put('0,64,0',Java.type('java.lang.Integer').valueOf(0));handler.invoke(event());check(Sink.packets===1&&Sink.payload.length===1,'Normal workbench recipe sync changed');
 check(bench.func_71903_a(w,0,64,0,p,1,0,0,0)&&p.craftingOpened===1,'Normal crafting activation changed');
 Recipes.instance=null;handler.invoke(event());check(Sink.packets===1,'Missing controller sent recipe packet');Recipes.instance=recipes;recipes.globalRecipes=null;handler.invoke(event());check(Sink.packets===1,'Missing recipe map sent packet');
 recipes.globalRecipes=new (Java.type('java.util.HashMap'))();w.field_72995_K=true;handler.invoke(event());check(Sink.packets===1,'Client-side recipe send');w.field_72995_K=false;
 w.blocks.put('0,64,0',Java.type('java.lang.Integer').valueOf(1));handler.invoke(event());check(Sink.packets===1,'Non-workbench sent recipes');
 handler.invoke(null);p.field_70170_p=null;handler.invoke(event());
 print('INTERACTION TEST PASSED: exact null-controller crash guarded, station event untouched, session activation, ordinary workbench recipes/crafting retained, missing map, client/non-bench/null-event cases');
}
