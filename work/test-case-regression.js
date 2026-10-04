var C=Java.type('OfflineCases'),Loot=Java.type('mqpx'),Group=Java.type('pixj'),Entry=Java.type('hscf');
var Item=Java.type('lrhp'),Stack=Java.type('voib'),List=Java.type('java.util.ArrayList');
var Type=Java.type('gloomyfolken.bundle.common.cases.CaseType');
var Fixture=Java.type('CaseScreenRegression');
function check(ok,msg){if(!ok)throw new Error(msg);}
for(var id=25000;id<25004;id++)new Item(id-256);
var loot=new Loot();
for(var g=0;g<3;g++){
 var entries=new List();for(var i=0;i<20;i++)entries.add(new Entry(25000+g,1,0,null,0,1));
 loot.groups.add(new Group('Group '+g,entries,1));
}
var BA=Java.type('voib[]');
for(var count=0;count<=3;count++){
 var rewards=new BA(count);for(var i=0;i<count;i++)rewards[i]=new Stack(25000+i,1,0);
 var preview=C.preview(new Stack(25003,1,0),loot,rewards);
 check(preview.loot.groups.size()===count,'Extra animation group for '+count+' rewards');
 for(var i=0;i<count;i++){
  var group=preview.loot.groups.get(i);check(!group.entryList.isEmpty(),'Empty animation group');
  var last=group.entryList.get(group.entryList.size()-1)._k();
  check(last._d===rewards[i]._d,'Winning reward missing from its group');
 }
 for(var groups=1;groups<=4;groups++){
  var type=new Type();type.loot=new Loot();for(var n=0;n<groups;n++)type.loot.groups.add(loot.groups.get(0));
  var screen=new Fixture();screen._k=rewards;screen._j=type;
  var expected=Math.min(count,groups);
  for(var click=0;click<10;click++){screen.accept();screen.click();}
  check(screen.closes===1,'Last reward closed '+screen.closes+' times');
  check(screen.resets===Math.max(0,expected-1),'Roulette reset after final reward');
  check(screen._m===Math.max(0,expected-1),'Reward index advanced out of range');
  check(screen.offlineCasesFinished,'Finished state not latched');
 }
}
print('REGRESSION PASSED: 0-3 rewards, 1-4 groups, repeated clicks; no extra stage or duplicate close');
