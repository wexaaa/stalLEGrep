var C=Java.type('OfflineCases');
var Loot=Java.type('mqpx'),Group=Java.type('pixj'),Entry=Java.type('hscf');
var Item=Java.type('lrhp'),Tag=Java.type('rtag'),List=Java.type('java.util.ArrayList');
var id=25000;
if(Item.field_77698_e[id]==null) new Item(id-256);
var tag=new Tag();tag['_a(java.lang.String,java.lang.String)']('case_test','preserved');
var entries=new List();entries.add(new Entry(id,292,7,tag,0,1));
var loot=new Loot();loot.groups.add(new Group('Test',entries,1));
for(var i=0;i<100;i++) {
 var rewards=C.roll(loot);
 if(rewards.length!==1 || rewards[0]._b!==292 || rewards[0]._f!==7 || rewards[0]._e._j('case_test')!=='preserved') throw new Error('Reward lost quantity, damage or NBT');
 rewards[0]._e['_a(java.lang.String,java.lang.String)']('case_test','changed');
 if(tag._j('case_test')!=='preserved') throw new Error('Reward mutated original loot tag');
}
var missing=new Loot();var bad=new List();bad.add(new Entry(24999,1,0,null,0,1));missing.groups.add(new Group('Bad',bad,1));
var rejected=false;try{C.roll(missing);}catch(e){rejected=true;}if(!rejected)throw new Error('Unknown reward accepted');
var never=new Loot();never.groups.add(new Group('Never',entries,-1));if(C.roll(never).length!==0)throw new Error('Group drop probability ignored');
print('REWARD TEST PASSED: 100 rolls; quantity, damage, NBT copies, missing item, group probability');
