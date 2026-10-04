// METHOD
public static boolean localWorld() {
    String name=System.getProperty("offline.world","");
    return name.length()>0;
}
// METHOD
public static yvlz stats(jlas player) {
    if(player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return null;
    lofu info=ognf._a(player);
    if(info==null) return null;
    gloomyfolken.mods.stalker.misc.qlfw handler=gloomyfolken.mods.stalker.misc.qlfw._a(info);
    return handler==null?null:handler._c;
}
// METHOD
public static float finite(float value) {
    return Float.isNaN(value) || Float.isInfinite(value)?0.0f:value;
}
// METHOD
public static float healthFactor(yvlz value) {
    return value==null?1.0f:Math.max(0.1f,1.0f+finite(value._a(yvlz.hrmt._u))/100.0f);
}
// METHOD
public static float damage(jlas player,float amount) {
    if(!localWorld() || !(amount>0.0f) || Float.isInfinite(amount)) return amount;
    // Native STALCRAFT uses normalized health: a health bonus increases effective HP.
    // Healing already divides by this same factor in hrmn, so do not also grow maxHealth.
    return amount/healthFactor(stats(player));
}
// METHOD
public static float healing(buao entity,float amount) {
    if(!localWorld() || !(entity instanceof jlas) || !(amount>0.0f) || Float.isInfinite(amount)) return amount;
    yvlz value=stats((jlas)entity);
    if(value==null) return amount;
    float factor=Math.max(0.0f,1.0f+finite(value._a(yvlz.hrmt._y))/100.0f);
    float result=amount*factor;
    return Float.isInfinite(result)?amount:result;
}
// METHOD
public static void refresh(jlas player) {
    if(!localWorld() || player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return;
    try { ServerPacketHandler.refreshPlayerStats(player); }
    catch(Exception failure) { System.err.println("[OfflineArtifactEffects] refresh: "+failure); }
}
// METHOD
public static void periodic(gsye player) {
    if(!localWorld() || player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K || player.field_70173_aa%20!=0) return;
    synchronized(player) {
        Integer old=(Integer)lastHealTick.get(player);
        if(old!=null && old.intValue()==player.field_70173_aa) return;
        lastHealTick.put(player,Integer.valueOf(player.field_70173_aa));
        yvlz value=stats(player);
        if(value==null || !(player.func_110143_aJ()>0.0f) || player.func_110143_aJ()>=player.func_110138_aP()) return;
        // Preserve this local server's regeneration rate; ARTEFAKT_HEAL is already
        // stored in internal health units (its tooltip converts them for display).
        float rate=Math.max(0.0f,finite(value._a(yvlz.hrmt._n)))/10.0f;
        rate+=Math.max(0.0f,finite(value._a(yvlz.hrmt._r)));
        if(rate>0.0f && !Float.isInfinite(rate)) player.func_70691_i(rate);
    }
}
