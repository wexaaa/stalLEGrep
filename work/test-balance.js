var C=Java.type('OfflineBalance'),Tag=Java.type('rtag');
function check(ok,message){if(!ok)throw new Error(message);}
var data=new Tag();data['_a(java.lang.String,java.lang.String)']('unrelated','keep');
check(C.value(data)===0,'New account must start at zero');
check(C.add(data,1000)===1000,'Initial credit');check(C.add(data,500)===1500,'Credit must add, not replace');
for each(var invalid in [0,-1,2147483647,9223372036854775807]){
 var rejected=false;try{C.add(data,invalid);}catch(e){rejected=true;}check(rejected,'Invalid/overflow credit accepted');check(C.value(data)===1500,'Invalid amount changed balance');
}
var other=new Tag();check(C.value(other)===0,'Balance leaked to another account');
var bytes=new (Java.type('java.io.ByteArrayOutputStream'))();
var output=new (Java.type('java.io.DataOutputStream'))(bytes);data['_a(java.io.DataOutput)'](output);output.close();
var restored=new Tag();restored['_a(java.io.DataInput,int)'](new (Java.type('java.io.DataInputStream'))(new (Java.type('java.io.ByteArrayInputStream'))(bytes.toByteArray())),0);
check(C.value(restored)===1500,'Balance lost after NBT save/load');check(restored._j('unrelated')==='keep','Unrelated player data changed');
check(C.spend(restored,100)===1400,'Case price was not deducted exactly once');
var purchaseRejected=false;try{C.spend(restored,1401);}catch(e){purchaseRejected=true;}
check(purchaseRejected && C.value(restored)===1400,'Insufficient funds changed the balance');
for each(var invalidPrice in [0,-10]){var denied=false;try{C.spend(restored,invalidPrice);}catch(e){denied=true;}check(denied && C.value(restored)===1400,'Invalid case price accepted');}
check(C.spend(restored,1400)===0,'Exact-balance purchase');
check(C.add(restored,1500)===1500,'Top-up after spending');
check(C.add(restored,2147483647-1500)===2147483647,'Maximum balance');
print('BALANCE TEST PASSED: additive credit, rejection/overflow, independent accounts, real NBT serialization');
