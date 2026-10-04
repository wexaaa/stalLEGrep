var C=Java.type('OfflineCases');
var data=C.catalog();
if(data.typeList.size()!==5) throw new Error('Expected five menu cases');
for each(var type in data.typeList.toArray()) {
 if(type.price!==C.price(type.case_id) || type.discountedPrice!==-1 || type._h()!==C.price(type.case_id) || type.loot==null || type.loot.groups.isEmpty()) throw new Error('Bad menu case: '+type.case_id);
 var entries=0; for each(var group in type.loot.groups.toArray()) entries+=group.entryList.size();
 print('CASE '+type.case_id+' '+type.name+' price='+type._h()+' groups='+type.loot.groups.size()+' entries='+entries);
}
if(Java.type('klsl')._a._b(0)!==null) throw new Error('Case incorrectly limited');
if(C.catalog()!==data) throw new Error('Catalog was unexpectedly reloaded');
print('CATALOG TEST PASSED');
