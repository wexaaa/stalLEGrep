// Native block -> tile factories, without a running world or graphics context.
var Unsafe=Java.type('sun.misc.Unsafe'),uf=Unsafe.class.getDeclaredField('theUnsafe');uf.setAccessible(true);var unsafe=uf.get(null);
var types=['ycpm','hsbt','tvdh','ccrj','vkim','zwun','owup','iedd','ssac'];
for each(var name in types){var T=Java.type(name),block=unsafe.allocateInstance(T.class),tile=block.func_72274_a(null);if(tile===null)throw new Error('Missing tile '+name);print('NATIVE FACTORY OK '+name+' -> '+tile.getClass().getName());}
print('9 native anomaly tile factories passed; no world mutation');
