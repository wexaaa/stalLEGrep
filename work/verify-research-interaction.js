var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');
var Jar=Java.type('java.util.jar.JarFile'),MD=Java.type('java.security.MessageDigest'),Arrays=Java.type('java.util.Arrays'),Class=Java.type('java.lang.Class');
var root=(offlineHome+'/classes/'),base=new Jar(root+'offline-patches.jar'),candidate=new Jar('work/offline-patches-research-interaction.jar'),nativeJar=new Jar(root+'classes.jar'),changed='noppes/npcs/events/CustomNpcsEvents.class';
Class.forName('noppes.npcs.events.CustomNpcsEvents',false,Java.type('javassist.ClassPool').class.getClassLoader());print('VERIFIED CustomNpcsEvents');
function hash(j,e){var md=MD.getInstance('SHA-256'),b=new (Java.type('byte[]'))(8192),n,s=j.getInputStream(e);while((n=s.read(b))>0)md.update(b,0,n);s.close();return String(Arrays.toString(md.digest()));}
var es=base.entries(),preserved=0;while(es.hasMoreElements()){var e=es.nextElement();if(String(e.getName())===changed)continue;var other=candidate.getJarEntry(e.getName());if(other===null||hash(base,e)!==hash(candidate,other))throw new Error('Prior fix changed: '+e.getName());preserved++;}
// Compare every other native method including GUI, NPC and world event methods.
var Reader=Java.type('org.objectweb.asm.ClassReader'),Node=Java.type('org.objectweb.asm.tree.ClassNode'),Trace=Java.type('org.objectweb.asm.util.TraceMethodVisitor'),Printer=Java.type('org.objectweb.asm.util.Textifier');
function methods(j){var node=new Node();new Reader(j.getInputStream(j.getJarEntry(changed))).accept(node,0);var out={};for each(var m in Java.from(node.methods.toArray())){var printer=new Printer();m.accept(new Trace(printer));out[String(m.name)+String(m.desc)]=String(printer.getText());}return out;}
var old=methods(base.getJarEntry(changed)!==null?base:nativeJar),updated=methods(candidate),unchanged=0;for(var key in old){if(key.indexOf('invoke(')===0)continue;if(old[key]!==updated[key])throw new Error('Unrelated NPC method changed: '+key);unchanged++;}
print('PRESERVED '+preserved+' prior JAR entries and '+unchanged+' other NPC methods; '+base.size()+' -> '+candidate.size()+' entries');
base.close();candidate.close();nativeJar.close();
