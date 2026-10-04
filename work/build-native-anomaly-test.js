var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
// Suppress NEI's startup-only mod-container tracking in an isolated headless test, not in the game.
var CP=Java.type('javassist.ClassPool'),pool=new CP(true),root=(offlineHome+'/');pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
var reporter=pool.get('codechicken.nei.IDConflictReporter');
for each(var name in ['blockConstructed','itemConstructed'])try{reporter.getDeclaredMethod(name).setBody('{}');}catch(ignore){}
reporter.writeFile('work/anomaly-native-test-only');print('Built isolated NEI startup adapter');
var block=pool.get('txrt');block.getClassInitializer().setBody('{field_71973_m=new txrt[4096];}');block.writeFile('work/anomaly-native-test-only');
var fluid=pool.get('net.minecraftforge.fluids.BlockFluidBase');fluid.getClassInitializer().setBody('{}');fluid.writeFile('work/anomaly-native-test-only');
