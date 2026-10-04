// METHOD
public static synchronized void ensureItems() {
    if(itemTemplates!=null && itemLabels!=null) return;
    java.util.Map templates=new java.util.LinkedHashMap();
    java.util.Map labels=new java.util.LinkedHashMap();
    if(lrhp.field_77698_e.length>58 && lrhp.field_77698_e[58]!=null) {
        templates.put("item:58:1000",OfflineResearch.station());
        labels.put("item:58:1000","Станок исследования артефактов [58:8]");
    }
    for(int id=1;id<lrhp.field_77698_e.length;id++) {
        lrhp item=lrhp.field_77698_e[id];
        if(item==null || item.field_77779_bT!=id) continue;
        java.util.List variants=new java.util.ArrayList();
        try { item.func_77633_a(id,item.func_77640_w(),variants); }
        catch(Exception failure) { System.err.println("[OfflineSpawner] item variants "+id+": "+failure); }
        catch(LinkageError failure) { System.err.println("[OfflineSpawner] item variants "+id+": "+failure); }
        for(int invalid=variants.size()-1;invalid>=0;invalid--) {
            Object value=variants.get(invalid);
            if(!(value instanceof voib) || ((voib)value)._d!=id) variants.remove(invalid);
        }
        if(variants.isEmpty()) variants.add(new voib(id,1,0));
        java.util.List accepted=new java.util.ArrayList();
        for(int index=0;index<variants.size();index++) {
            Object value=variants.get(index);
            if(!(value instanceof voib)) continue;
            voib stack=(voib)value;
            if(stack._d!=id || stack._a()!=item) continue;
            // The station already has a stable explicit token, even when NEI exposes it as a native variant.
            if(id==58 && stack._f==8) continue;
            boolean duplicate=false;
            for(int previous=0;previous<accepted.size();previous++) {
                voib existing=(voib)accepted.get(previous);
                if(existing._f==stack._f && voib._a(existing,stack)) { duplicate=true; break; }
            }
            if(duplicate) continue;
            voib template=stack._l();
            template._b=1;
            String name=null;
            try { name=template._s(); }
            catch(Exception failure) { }
            catch(LinkageError failure) { }
            if(name==null || name.length()==0) {
                try { name=item.func_77658_a(); }
                catch(Exception failure) { }
                catch(LinkageError failure) { }
            }
            if(name==null || name.length()==0) name="Предмет";
            name=name.replaceAll("§.","").replace('\n',' ').replace('\r',' ');
            String token="item:"+id+":"+accepted.size();
            String label=name+" ["+id+":"+template._f+"]";
            if(accepted.size()>0) label=label+" (вариант "+(accepted.size()+1)+")";
            accepted.add(template);
            templates.put(token,template);
            labels.put(token,label);
        }
    }
    itemTemplates=java.util.Collections.unmodifiableMap(templates);
    itemLabels=java.util.Collections.unmodifiableMap(labels);
}
// METHOD
public static java.util.Map itemEntries() {
    ensureItems();
    return itemLabels;
}
// METHOD
public static void giveItem(String value,jlas player) {
    String[] parts=value.split(":");
    if(parts.length!=3 && parts.length!=4) throw new IllegalArgumentException("Неверный запрос выдачи предмета.");
    String destination=parts.length==3?"legacy":parts[3];
    if(parts.length==4 && !destination.equals("vanilla") && !destination.equals("stalcraft")) throw new IllegalArgumentException("Неизвестный инвентарь.");
    int id=Integer.parseInt(parts[0]);
    int variant=Integer.parseInt(parts[1]);
    int count=Integer.parseInt(parts[2]);
    if(count<1 || count>64) throw new IllegalArgumentException("Количество должно быть от 1 до 64.");
    ensureItems();
    String token="item:"+id+":"+variant;
    voib template=(voib)itemTemplates.get(token);
    if(template==null || template._a()==null) throw new IllegalArgumentException("Предмет или вариант отсутствует в реестре.");
    int limit=Math.max(1,Math.min(64,template._d()));
    mbgk custom=null;
    if(destination.equals("vanilla") && (player.field_71071_by==null || player.field_71071_by._a==null)) throw new IllegalArgumentException("Обычный инвентарь недоступен.");
    if(destination.equals("stalcraft")) {
        custom=zyjs._b(player);
        if(custom==null) throw new IllegalArgumentException("Инвентарь STALCRAFT недоступен.");
    }
    int remaining=count;
    while(remaining>0) {
        voib stack=template._l();
        int amount=Math.min(remaining,limit);
        stack._b=amount;
        if(destination.equals("legacy")) {
            ServerPacketHandler.giveItemToPlayer(player,stack);
            remaining-=amount;
        } else {
            if(destination.equals("vanilla")) giveVanilla(player.field_71071_by,stack);
            else custom.appendStackPartially(stack);
            remaining-=amount-stack._b;
            if(stack._b>0) break;
        }
    }
    if(destination.equals("legacy")) {
        ServerPacketHandler.syncInventory(player);
        player.func_71035_c("[Спавнер] Выдача: "+(String)itemLabels.get(token)+" × "+count+". Если места не хватило, проверь предметы рядом с собой.");
    } else {
        int issued=count-remaining;
        if(issued>0) {
            if(custom!=null) custom.detectAndSendChanges(player);
            ServerPacketHandler.syncInventory(player);
        }
        String name=destination.equals("vanilla")?"обычный инвентарь (панель быстрого доступа)":"инвентарь STALCRAFT";
        player.func_71035_c("[Спавнер] Выдано "+issued+" / "+count+": "+(String)itemLabels.get(token)+" → "+name+"."+(remaining>0?" Не хватило места или допустимого веса; остаток не выдан, в другой инвентарь не переносится.":""));
    }
}
// METHOD
public static void giveVanilla(qptu inventory,voib stack) {
    voib[] slots=inventory._a;
    int size=Math.min(36,slots.length);
    // Merge only identical metadata/NBT; never use the creative-mode overflow deletion path.
    for(int i=0;i<size && stack._b>0;i++) {
        voib existing=slots[i];
        if(existing==null || existing._b<=0 || existing._d!=stack._d || existing._f!=stack._f || !voib._a(existing,stack)) continue;
        int limit=Math.max(1,Math.min(64,Math.min(existing._d(),stack._d())));
        int amount=Math.min(stack._b,Math.max(0,limit-existing._b));
        if(amount>0) { existing._b+=amount; existing._c=5; stack._b-=amount; }
    }
    // Hotbar slots are first, so blocks can immediately be selected and placed.
    for(int i=0;i<size && stack._b>0;i++) {
        if(slots[i]!=null && slots[i]._b>0) continue;
        int amount=Math.min(stack._b,Math.max(1,Math.min(64,stack._d())));
        voib copy=stack._l(); copy._b=amount; copy._c=5;
        slots[i]=copy; stack._b-=amount;
    }
    inventory.func_70296_d();
}
// METHOD
public static boolean safeAnomaly(txrt block) {
    return block!=null && (block instanceof ycqf || block instanceof ssac) && !(block instanceof kkit);
}
// METHOD
public static java.util.Map anomalyEntries() {
    java.util.Map result=new java.util.TreeMap();
    for(int i=1;i<txrt.field_71973_m.length;i++) {
        txrt block=txrt.field_71973_m[i];
        if(safeAnomaly(block)) result.put("anomaly:"+i,((gloomyfolken.mods.anomaly.uxsl)block)._a());
    }
    return result;
}
// METHOD
public static void spawnAnomaly(String value,jlas player) {
    int id=Integer.parseInt(value);
    if(id<=0 || id>=txrt.field_71973_m.length || !safeAnomaly(txrt.field_71973_m[id])) throw new IllegalArgumentException("Эта аномалия не поддерживает локальный спавн.");
    lrzy world=player.field_70170_p;
    double angle=Math.toRadians((double)player.field_70177_z);
    int baseY=(int)Math.floor(player.field_70163_u);
    for(int distance=5;distance<=10;distance++) {
        int x=(int)Math.floor(player.field_70165_t-Math.sin(angle)*distance);
        int z=(int)Math.floor(player.field_70161_v+Math.cos(angle)*distance);
        for(int offset=2;offset>=-16;offset--) {
            int y=baseY+offset;
            if(y<1 || y>253 || !world.func_72899_e(x,y,z)) continue;
            // Anomaly blocks report isAirBlock=true: check the exact ID to avoid replacing an existing anomaly.
            if(world.func_72798_a(x,y,z)!=0 || world.func_72798_a(x,y+1,z)!=0 || !world.func_72809_s(x,y-1,z)) continue;
            net.minecraft.util.dfak box=net.minecraft.util.dfak._a((double)x-1.0d,(double)y,(double)z-1.0d,(double)x+2.0d,(double)y+2.0d,(double)z+2.0d);
            if(!world.func_72872_a(xuac.class,box).isEmpty()) continue;
            if(!world.func_72832_d(x,y,z,id,0,3)) throw new IllegalArgumentException("Мир отклонил создание аномалии.");
            try {
                if(world.func_72796_p(x,y,z)==null) throw new IllegalStateException("Не удалось создать обработчик аномалии.");
                world.func_72902_n(x,y,z);
            } catch(Exception failure) {
                if(world.func_72798_a(x,y,z)==id) world.func_94571_i(x,y,z);
                throw failure;
            }
            player.func_71035_c("[Спавнер] Аномалия «"+((gloomyfolken.mods.anomaly.uxsl)txrt.field_71973_m[id])._a()+"» создана: "+x+", "+y+", "+z+". Осторожно: наносит урон!");
            return;
        }
    }
    throw new IllegalArgumentException("Нет свободного места на земле перед тобой. Выйди на открытую площадку.");
}
// METHOD
public static String spawnConfig(gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration config) {
    String data=java.util.Base64.getEncoder().encodeToString(config.toJson().getBytes(java.nio.charset.StandardCharsets.UTF_8));
    if(data.length()>60000) throw new IllegalArgumentException("Конфигурация мутанта слишком большая для сетевого появления.");
    return "offline-mutant-v1:"+data;
}
// METHOD
public static gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration resolveSpawnConfig(String name) {
    gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper client=gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper.CLIENT;
    if(!name.startsWith("offline-mutant-v1:")) return client.getMobConfiguration(name);
    String json=new String(java.util.Base64.getDecoder().decode(name.substring(18)),java.nio.charset.StandardCharsets.UTF_8);
    gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration config=(gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration)gloomyfolken.mods.stalker.mobs.entity.config.ConfigJsonHelper.Companion.read(json,gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration.class);
    if(config==null || config.getCommon().getName().length()==0) throw new IllegalArgumentException("Пустая конфигурация мутанта.");
    client.addMobConfig(config.getCommon().getName(),config);
    return config;
}
// METHOD
public static boolean safeClass(Class type) {
    return type!=null && buao.class.isAssignableFrom(type) && !jlas.class.isAssignableFrom(type) && !java.lang.reflect.Modifier.isAbstract(type.getModifiers());
}
// METHOD
public static java.util.Map entries() {
    java.util.Map result=new java.util.TreeMap();
    java.util.Iterator it=pmie._a.entrySet().iterator();
    while(it.hasNext()) {
        java.util.Map.Entry entry=(java.util.Map.Entry)it.next();
        Class type=(Class)entry.getValue();
        if (!safeClass(type) || gloomyfolken.mods.stalker.mobs.entity.EntityMutant.class.isAssignableFrom(type)) continue;
        try { type.getConstructor(new Class[]{lrzy.class}); }
        catch(NoSuchMethodException unsupported) { continue; }
        String name=(String)entry.getKey();
        result.put("entity:"+name,"Сущность: "+name);
    }
    java.util.Map configs=gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper.SERVER.getMobConfigs();
    it=configs.keySet().iterator();
    while(it.hasNext()) {
        String name=(String)it.next();
        result.put("mutant:"+name,"Мутант: "+name);
    }
    it=gloomyfolken.mods.stalker.mobs.entity.MutantRegistry.INSTANCE.getRegisteredMobs().entrySet().iterator();
    while(it.hasNext()) {
        java.util.Map.Entry entry=(java.util.Map.Entry)it.next();
        if (safeClass((Class)entry.getValue())) result.put("base:"+(String)entry.getKey(),"Базовый мутант: "+(String)entry.getKey());
    }
    return result;
}
// METHOD
public static String command(String token) {
    String encoded=java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    if (encoded.length()>85) throw new IllegalArgumentException("Слишком длинный запрос для команды.");
    return "/localspawn "+encoded;
}
// METHOD
public static boolean handleChat(String text, jlas player) {
    if(OfflineResearch.handleChat(text,player)) return true;
    if (text==null || !text.startsWith("/localspawn ")) return false;
    if (player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return true;
    if (!player.func_70005_c_().equalsIgnoreCase("wexa") && !player.func_70003_b(2,"localspawn")) {
        player.func_71035_c("[Спавнер] Инструмент доступен владельцу wexa и операторам локального сервера.");
        return true;
    }
    synchronized(player) {
        long now=System.currentTimeMillis();
        Long last=(Long)lastSpawn.get(player);
        if (last!=null && now-last.longValue()<750L) return true;
        lastSpawn.put(player,Long.valueOf(now));
        try {
            String encoded=text.substring(12).trim();
            if (encoded.length()>85) throw new IllegalArgumentException("Недопустимое имя.");
            String token=new String(java.util.Base64.getUrlDecoder().decode(encoded),java.nio.charset.StandardCharsets.UTF_8);
            if(token.startsWith("item:")) { giveItem(token.substring(5),player); return true; }
            if(token.startsWith("anomaly:")) { spawnAnomaly(token.substring(8),player); return true; }
            xuac entity=null;
            if (token.startsWith("base:")) {
                String name=token.substring(5);
                Class type=(Class)gloomyfolken.mods.stalker.mobs.entity.MutantRegistry.INSTANCE.getRegisteredMobs().get(name);
                if (safeClass(type)) {
                    String configName="local_spawn_"+name;
                    gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration config=gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper.SERVER.getMobConfiguration(configName);
                    if (config==null) {
                        config=new gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration();
                        config.getCommon().setEntityClass(name);
                        config.getCommon().setName(configName);
                        gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper.SERVER.addMobConfig(configName,config);
                    }
                    entity=config.instantiateEntity(player.field_70170_p);
                }
            } else if (token.startsWith("mutant:")) {
                gloomyfolken.mods.stalker.mobs.entity.config.MutantConfiguration config=gloomyfolken.mods.stalker.mobs.entity.config.MutantConfigHelper.SERVER.getMobConfiguration(token.substring(7));
                if (config!=null) entity=config.instantiateEntity(player.field_70170_p);
            } else if (token.startsWith("entity:")) {
                String name=token.substring(7);
                Class type=(Class)pmie._a.get(name);
                if (safeClass(type) && !gloomyfolken.mods.stalker.mobs.entity.EntityMutant.class.isAssignableFrom(type)) entity=pmie._a(name,player.field_70170_p);
            }
            if (entity==null) throw new IllegalArgumentException("Сущность отсутствует или не поддерживает обычный спавн.");
            double angle=Math.toRadians((double)player.field_70177_z);
            boolean placed=false;
            for(int distance=4;distance<=7 && !placed;distance++) for(int up=0;up<=2 && !placed;up++) {
                double x=player.field_70165_t-Math.sin(angle)*distance;
                double z=player.field_70161_v+Math.cos(angle)*distance;
                entity.func_70012_b(x,player.field_70163_u+up+0.1d,z,player.field_70177_z,0.0f);
                if (player.field_70170_p.func_72945_a(entity,entity.field_70121_D).isEmpty()) placed=true;
            }
            if (!placed) throw new IllegalArgumentException("Перед тобой нет свободного места. Выйди на открытую площадку.");
            if (!player.field_70170_p.func_72838_d(entity)) throw new IllegalArgumentException("Мир отклонил спавн сущности.");
            player.func_71035_c("[Спавнер] Создана сущность "+token.substring(token.indexOf(':')+1)+". Враждебные сущности могут атаковать!");
        } catch(Exception error) {
            System.err.println("[OfflineSpawner] "+error);
            player.func_71035_c("[Спавнер] Не удалось выполнить запрос: "+error.getMessage());
        }
    }
    return true;
}
// METHOD
public static void clientTick(Object client) {
    if (!org.lwjgl.input.Keyboard.isCreated()) return;
    boolean down=org.lwjgl.input.Keyboard.isKeyDown(65);
    boolean pressed=down && !keyHeld;
    keyHeld=down;
    if (!pressed) return;
    net.minecraft.client.qlfw mc=(net.minecraft.client.qlfw)client;
    if (mc._t==null || mc._B!=null) return;
    if (mc._H==null) { mc._t.func_71035_c("[Спавнер] Открой инструмент на компьютере владельца локального мира."); return; }
    try { mc._a(new OfflineSpawnerGui()); }
    catch(Exception error) { System.err.println("[OfflineSpawner] menu: "+error); mc._t.func_71035_c("[Спавнер] Не удалось открыть меню: "+error.getMessage()); }
}
