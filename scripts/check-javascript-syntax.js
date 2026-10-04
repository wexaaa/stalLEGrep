// JJS/Java 8 syntax check only: never execute the patch builders.
(function () {
var engine = new (Java.type('javax.script.ScriptEngineManager'))().getEngineByName('nashorn');
var Files = Java.type('java.nio.file.Files'), Paths = Java.type('java.nio.file.Paths');
var stream = Files.list(Paths.get('work')), count = 0;
var paths;
try { paths = stream.toArray(); } finally { stream.close(); }
for (var index=0; index<paths.length; index++) {
        var path = paths[index];
        if (!String(path).endsWith('.js')) continue;
        var reader = Files.newBufferedReader(path, Java.type('java.nio.charset.StandardCharsets').UTF_8);
        try { engine.compile(reader); count++; } finally { reader.close(); }
}
if(count!==80) throw new Error('Expected 80 JavaScript sources, got '+count);
print('PASS: parsed '+count+' source scripts without executing patches.');
})();
