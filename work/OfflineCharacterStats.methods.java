// METHOD
public static boolean enabled() {
    return System.getProperty("offline.world","").length()>0;
}
// METHOD
public static float finite(float value) {
    return Float.isNaN(value)||Float.isInfinite(value)?0.0f:value;
}
// METHOD
public static String number(float value) {
    java.math.BigDecimal n=new java.math.BigDecimal(Float.toString(finite(value)));
    return n.setScale(2,java.math.RoundingMode.HALF_UP).stripTrailingZeros().toPlainString();
}
// METHOD
public static int color(float delta,boolean smallerBetter) {
    if(Math.abs(delta)<0.00001f) return 0xffd4d2cf;
    return (smallerBetter?delta<0.0f:delta>0.0f)?0xff69c44a:0xffdc766c;
}
// METHOD
public static void header(java.util.List rows,String title) {
    rows.add(new String[]{title,"","header"});
}
// METHOD
public static void row(java.util.List rows,String title,String value,int tint) {
    rows.add(new String[]{title,value,Integer.toString(tint)});
}
// METHOD
public static float stat(yvlz values,yvlz.hrmt factor) {
    return values==null?0.0f:finite(values._a(factor));
}
// METHOD
public static void factor(java.util.List rows,yvlz values,yvlz.hrmt kind) {
    float raw=stat(values,kind),display=kind._S?-raw:raw;
    if(kind._O==2) display*=5.0f;
    if(kind._Q && kind._O==4) display+=100.0f;
    row(rows,kind._M,number(display)+(kind._Q?"%":""),color(raw,kind._P));
}
// METHOD
public static float attribute(cuno value,float fallback) {
    if(value==null) return fallback;
    Object raw=value._c();
    if(!(raw instanceof Number)) return fallback;
    float result=((Number)raw).floatValue();
    return Float.isNaN(result)||Float.isInfinite(result)?fallback:result;
}
// METHOD
public static java.util.List rows(jlas player) {
    java.util.List rows=new java.util.ArrayList();
    if(player==null || player.field_70170_p==null) { header(rows,"Персонаж не загружен"); return rows; }
    lofu info=ognf._a(player);
    gloomyfolken.mods.stalker.misc.qlfw h=info==null?null:gloomyfolken.mods.stalker.misc.qlfw._a(info);
    if(h==null || h._c==null) { header(rows,"Ожидание характеристик..."); return rows; }
    yvlz s=h._c;
    header(rows,"Основные характеристики");
    float health=Math.max(0.0f,finite(player.func_110143_aJ()));
    float maxHealth=Math.max(0.1f,finite(player.func_110138_aP()));
    float vitality=Math.min(100.0f,health/maxHealth*100.0f);
    float healthFactor=Math.max(0.1f,1.0f+stat(s,yvlz.hrmt._u)/100.0f);
    row(rows,"Живучесть",number(vitality)+"%",vitality<25.0f?0xffdc766c:0xffd4d2cf);
    row(rows,"Здоровье",number(health*5.0f*healthFactor)+" / "+number(maxHealth*5.0f*healthFactor),color(stat(s,yvlz.hrmt._u),false));
    float stamina=Math.max(0.1f,attribute(h._d,1.0f+stat(s,yvlz.hrmt._t)/100.0f))*100.0f;
    row(rows,"Выносливость",number(stamina)+"%",color(stamina-100.0f,false));
    float weightFactor=Math.max(0.0f,finite(h._q()));
    float speed=Math.max(0.05f,Math.min(3.0f,(1.0f+stat(s,yvlz.hrmt._m)/100.0f)*weightFactor))*100.0f;
    row(rows,"Скорость",number(speed)+"%",color(speed-100.0f,false));
    float carry=finite(h._p());
    if(!(carry>0.0f)) carry=Math.max(0.0f,finite(htza._a)+stat(s,yvlz.hrmt._o));
    row(rows,"Переносимый вес",number(carry)+" кг",color(stat(s,yvlz.hrmt._o),false));
    float weight=Math.max(0.0f,finite(h._o()));
    row(rows,"Вес инвентаря",number(weight)+" кг",weight>carry?0xffdc766c:0xffd4d2cf);
    float recovery=Math.max(0.1f,attribute(h._e,1.0f+stat(s,yvlz.hrmt._s)/100.0f))*100.0f;
    row(rows,"Восст. выносливости",number(recovery)+"%",color(recovery-100.0f,false));
    row(rows,"Бонус регенерации",number(stat(s,yvlz.hrmt._n))+"%",color(stat(s,yvlz.hrmt._n),false));
    factor(rows,s,yvlz.hrmt._r);
    row(rows,"Эффективность лечения",number(Math.max(0.0f,100.0f+stat(s,yvlz.hrmt._y)))+"%",color(stat(s,yvlz.hrmt._y),false));
    row(rows,"Бонус скорости",number(stat(s,yvlz.hrmt._m))+"%",color(stat(s,yvlz.hrmt._m),false));
    row(rows,"Штраф за перевес",number(Math.max(0.0f,1.0f-weightFactor)*100.0f)+"%",color(weightFactor-1.0f,false));
    row(rows,"Бонус прыжка",number(stat(s,yvlz.hrmt._p)),color(stat(s,yvlz.hrmt._p),false));
    header(rows,"Защитные характеристики");
    factor(rows,s,yvlz.hrmt._a);factor(rows,s,yvlz.hrmt._c);factor(rows,s,yvlz.hrmt._e);
    factor(rows,s,yvlz.hrmt._b);factor(rows,s,yvlz.hrmt._f);factor(rows,s,yvlz.hrmt._d);
    header(rows,"Защита от заражений");
    factor(rows,s,yvlz.hrmt._z);factor(rows,s,yvlz.hrmt._A);factor(rows,s,yvlz.hrmt._B);
    factor(rows,s,yvlz.hrmt._C);factor(rows,s,yvlz.hrmt._D);factor(rows,s,yvlz.hrmt._E);factor(rows,s,yvlz.hrmt._F);
    header(rows,"Сопротивления урону");
    factor(rows,s,yvlz.hrmt._G);factor(rows,s,yvlz.hrmt._H);factor(rows,s,yvlz.hrmt._I);
    factor(rows,s,yvlz.hrmt._J);factor(rows,s,yvlz.hrmt._K);factor(rows,s,yvlz.hrmt._L);
    header(rows,"Накопление воздействий");
    factor(rows,s,yvlz.hrmt._g);factor(rows,s,yvlz.hrmt._h);factor(rows,s,yvlz.hrmt._i);
    factor(rows,s,yvlz.hrmt._j);factor(rows,s,yvlz.hrmt._k);factor(rows,s,yvlz.hrmt._l);
    header(rows,"Обращение с оружием");
    factor(rows,s,yvlz.hrmt._v);factor(rows,s,yvlz.hrmt._w);factor(rows,s,yvlz.hrmt._x);
    header(rows,"Дополнительные свойства");
    factor(rows,s,yvlz.hrmt._q);
    return rows;
}
