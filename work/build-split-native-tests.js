var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var CP=Java.type('javassist.ClassPool'),Field=Java.type('javassist.CtField'),pool=new CP(true),root=(offlineHome+'/');
pool.appendClassPath('work/container-test-only');pool.appendClassPath('work/split-test-only');pool.appendClassPath('work/research-test-only');pool.appendClassPath('work/item-test-only');pool.appendClassPath(root+'classes/classes.jar');pool.appendClassPath(root+'classes/libs.jar');
// Preserve native grid and section bytecode. Only window ownership/delivery are test adapters.
var nativePool=new CP(true);nativePool.appendClassPath(root+'classes/classes.jar');nativePool.appendClassPath(root+'classes/libs.jar');nativePool.get('zhku').writeFile('work/split-native-test-only');
pool.insertClassPath('work/split-native-test-only');
var view=pool.get('dhmd');view.addField(Field.make('public int reject=-1;',view));view.getDeclaredMethod('bindMutable').setBody('{if($1==null || $1._a()!=0 || $1._b()!=0 || $1._c()<0 || $1._c()>=section.size())throw new IllegalArgumentException("Invalid slot");return new dhmd$vjtu(this,$1);}');view.getDeclaredMethod('canPlayerTakeStacks').setBody('{return true;}');view.getDeclaredMethod('canPlayerPutStack').setBody('{return true;}');view.getDeclaredMethod('get').setBody('{return section.getStackAt($1._c());}');view.writeFile('work/split-native-test-only');
// Compile the bindings against the real native section API rather than synthetic arrays.
var binding=pool.get('dhmd$vjtu');binding.getDeclaredMethod('_g').setBody('{return view.section.getStackAt(index._c());}');binding.getDeclaredMethod('_a').setBody('{if(index._c()==view.reject)return false;return view.section.setStackAt(index._c(),$1);}');binding.writeFile('work/split-native-test-only');
print('BUILT native vmaw/zhku grid fixture, with window/delivery adapters');
