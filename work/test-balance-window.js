var C=Java.type('OfflineBalance'),Client=Java.type('net.minecraft.client.qlfw'),Dialog=Java.type('twij'),Screen=Java.type('TestBalanceScreen'),Buffer=Java.type('klsl');
var parent=new Screen(),dialog=new Dialog();dialog.parentScreen=parent;Client._I()._B=dialog;
for(var i=0;i<10;i++)C.receive(i*100);
if(Client._I()._B!==dialog || dialog.closes!==0)throw new Error('Balance update closed the top-up dialog');
if(Buffer._d()!==900 || parent.balance!==900)throw new Error('Parent balance failed to update');
Client._I()._B=parent;C.receive(700);
if(parent.balance!==700 || Buffer._d()!==700)throw new Error('Case balance failed to refresh');
print('WINDOW REGRESSION PASSED: actual receive method keeps dialog open and updates parent/case balance');
