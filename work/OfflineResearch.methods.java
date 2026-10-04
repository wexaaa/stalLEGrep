// METHOD
public static voib station() {
    voib stack=new voib(58,1,8);
    stack._a("Станок исследования артефактов");
    return stack;
}
// METHOD
public static boolean isStation(lrzy world,int x,int y,int z) {
    return world!=null && world.func_72899_e(x,y,z) && world.func_72798_a(x,y,z)==58 && world.func_72805_g(x,y,z)==8;
}
// METHOD
public static boolean activate(lrzy world,int x,int y,int z,jlas player) {
    if(!isStation(world,x,y,z)) return false;
    if(player==null) return true;
    if(world.field_72995_K) {
        try { net.minecraft.client.qlfw._I()._a(new OfflineResearchGui()); }
        catch(Exception failure) { player.func_71035_c("[Исследование] Не удалось открыть станок: "+failure.getMessage()); }
    } else {
        sessions.put(player,new Object[]{world,new int[]{x,y,z},Long.valueOf(System.currentTimeMillis())});
    }
    return true;
}
// METHOD
public static voib artifactInside(voib stack) {
    if(stack==null || stack._b<=0 || stack._a()==null) return null;
    if(stack._a() instanceof bsmb) return stack;
    if(!(stack._a() instanceof ujby) || stack._e==null || !stack._e._c("item")) return null;
    rtag tag=stack._e._m("item");
    int id=tag._e("id");
    if(id<=0 || id>=lrhp.field_77698_e.length || !(lrhp.field_77698_e[id] instanceof bsmb)) return null;
    voib inner=voib._a(tag);
    return inner!=null && inner._b==1?inner:null;
}
// METHOD
public static boolean canResearch(voib stack) {
    voib inner=artifactInside(stack);
    return inner!=null && !((kmcb)inner._a())._r_(inner);
}
// METHOD
public static void canonicalTag(java.io.DataOutput output,jlim tag,int depth) throws java.io.IOException {
    if(depth>32) throw new IllegalArgumentException("Слишком глубокие данные предмета.");
    if(tag==null) { output.writeByte(0); return; }
    output.writeByte(tag._a());
    if(tag instanceof rtag) {
        java.util.Map sorted=new java.util.TreeMap(((rtag)tag)._c);
        output.writeInt(sorted.size());
        java.util.Iterator it=sorted.entrySet().iterator();
        while(it.hasNext()) {
            java.util.Map.Entry entry=(java.util.Map.Entry)it.next();
            output.writeUTF((String)entry.getKey());
            canonicalTag(output,(jlim)entry.getValue(),depth+1);
        }
    } else if(tag instanceof aroe) {
        java.util.List values=((aroe)tag)._c;
        output.writeInt(values.size());
        for(int i=0;i<values.size();i++) canonicalTag(output,(jlim)values.get(i),depth+1);
    } else tag._a(output);
}
// METHOD
public static String fingerprint(voib stack) {
    try {
        java.io.ByteArrayOutputStream bytes=new java.io.ByteArrayOutputStream();
        java.io.DataOutputStream output=new java.io.DataOutputStream(bytes);
        output.writeInt(stack._d); output.writeInt(stack._f); output.writeInt(stack._b);
        canonicalTag(output,stack._e,0);
        output.flush();
        if(bytes.size()>1048576) throw new IllegalArgumentException("Слишком большие данные предмета.");
        byte[] hash=java.security.MessageDigest.getInstance("SHA-256").digest(bytes.toByteArray());
        return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(java.util.Arrays.copyOf(hash,16));
    } catch(Exception failure) { throw new IllegalArgumentException("Не удалось проверить данные предмета.",failure); }
}
// METHOD
public static java.util.Map entries(jlas player) {
    java.util.Map result=new java.util.LinkedHashMap();
    java.util.Iterator it=ServerPacketHandler.getInventoryStacks(player).iterator();
    while(it.hasNext()) {
        voib stack=(voib)it.next();
        try {
            if(!canResearch(stack)) continue;
            String name=stack._s().replaceAll("§.","").replace('\n',' ').replace('\r',' ');
            result.put("research:"+fingerprint(stack),name+" ["+stack._d+"]"+(stack._b>1?" × "+stack._b+" — раздели стопку":" — Исследовать"));
        } catch(Exception failure) { System.err.println("[OfflineResearch] catalog: "+failure); }
    }
    return result;
}
// METHOD
public static voib researchCopy(voib source) {
    if(source==null || source._b!=1) throw new IllegalArgumentException("Исследуется один артефакт. Сначала раздели стопку.");
    if(!canResearch(source)) throw new IllegalArgumentException("Это не неизвестный артефакт или он уже исследован.");
    voib copy=source._l();
    if(copy._a() instanceof ujby) {
        java.util.List revealed=((kmcb)copy._a())._d(copy);
        if(revealed.size()!=1) throw new IllegalArgumentException("Не удалось раскрыть артефакт.");
        copy=((voib)revealed.get(0))._l();
    }
    if(!(copy._a() instanceof bsmb) || copy._b!=1) throw new IllegalArgumentException("Неверные данные найденного артефакта.");
    java.util.List results=((kmcb)copy._a())._d(copy);
    if(results.size()!=1) throw new IllegalArgumentException("Исследование не вернуло артефакт.");
    voib result=((voib)results.get(0))._l();
    if(!(result._a() instanceof bsmb) || result._b!=1 || !((kmcb)result._a())._r_(result)) throw new IllegalArgumentException("Не удалось исследовать свойства артефакта.");
    return result;
}
// METHOD
public static void research(String key,jlas player) {
    Object[] session=(Object[])sessions.get(player);
    if(session==null || session[0]!=player.field_70170_p || System.currentTimeMillis()-((Long)session[2]).longValue()>300000L) throw new IllegalArgumentException("Сначала открой станок исследования в своём мире.");
    int[] position=(int[])session[1];
    double dx=player.field_70165_t-position[0]-0.5d;
    double dy=player.field_70163_u-position[1]-0.5d;
    double dz=player.field_70161_v-position[2]-0.5d;
    if(dx*dx+dy*dy+dz*dz>64.0d || !isStation(player.field_70170_p,position[0],position[1],position[2])) throw new IllegalArgumentException("Станок далеко или уже убран. Подойди и открой его снова.");
    if(key.length()!=22 || !key.matches("[A-Za-z0-9_-]+")) throw new IllegalArgumentException("Неверный запрос исследования.");
    voib selected=null;
    java.util.Iterator it=ServerPacketHandler.getInventoryStacks(player).iterator();
    while(it.hasNext()) {
        voib stack=(voib)it.next();
        if(canResearch(stack) && fingerprint(stack).equals(key)) { selected=stack; break; }
    }
    if(selected==null) throw new IllegalArgumentException("Артефакт уже изменился, исследован или отсутствует в твоём инвентаре. Открой станок снова.");
    voib result=researchCopy(selected);
    // Commit only after all native research and validation succeed. No intermediate container/consumption.
    selected._d=result._d;
    selected._f=result._f;
    selected._e=result._e;
    ServerPacketHandler.syncInventory(player);
    player.func_71035_c("[Исследование] Артефакт исследован и оставлен в твоём инвентаре.");
}
// METHOD
public static boolean handleChat(String text,jlas player) {
    if(text==null || !text.startsWith("/localspawn ")) return false;
    String token;
    try {
        String encoded=text.substring(12).trim();
        if(encoded.length()>85) return false;
        token=new String(java.util.Base64.getUrlDecoder().decode(encoded),java.nio.charset.StandardCharsets.UTF_8);
    } catch(Exception failure) { return false; }
    if(!token.startsWith("research:")) return false;
    if(player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return true;
    synchronized(player) {
        long now=System.currentTimeMillis();
        Long last=(Long)lastRequest.get(player);
        if(last!=null && now-last.longValue()<750L) return true;
        lastRequest.put(player,Long.valueOf(now));
        try { research(token.substring(9),player); }
        catch(Exception failure) { System.err.println("[OfflineResearch] "+failure); player.func_71035_c("[Исследование] "+failure.getMessage()); }
    }
    return true;
}
