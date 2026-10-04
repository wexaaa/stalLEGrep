var Config=Java.type('gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration');
var types=['dog','cat','boar','doge','flesh','psidog','pseudodog','psidog_clone','chimera','snork','krovosos','pseudogigant','tushkan'];
for each(var name in types){
 var config=new Config();config.getCommon().setEntityClass(name);config.getCommon().setName('local_spawn_'+name);
 if(config.getName()!=='local_spawn_'+name || config.getCommon().getEntityClass()!==name || config.getCommon().getScale()<=0 || config.getHealth()===null || config.getAi()===null)throw new Error('Invalid base config: '+name);
}
print('REAL DEFAULT CONFIG TEST PASSED: 13 mutant types, names, scale, health/AI groups');
