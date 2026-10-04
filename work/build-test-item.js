// Isolated test-only registry. Never included in the installed patch.
var CP=Java.type('javassist.ClassPool'),Field=Java.type('javassist.CtField');
var Constructor=Java.type('javassist.CtNewConstructor');
var pool=new CP(true);
var item=pool.makeClass('lrhp');
item.addField(Field.make('public static lrhp[] field_77698_e = new lrhp[32768];',item));
item.addField(Field.make('public int field_77779_bT;',item));
item.addConstructor(Constructor.make('public lrhp(int id) { field_77779_bT=id+256; field_77698_e[id+256]=this; }',item));
item.writeFile('work/test-only');
print('TEST-ONLY lrhp built');
