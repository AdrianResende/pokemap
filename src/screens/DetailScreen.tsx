import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, POKEMON_LIST, SPRITE_URL, ARTWORK_URL, TYPE_COLORS } from '../theme';
import { TypeBadge, StatBars } from '../components';

const { width } = Dimensions.get('window');
const TABS = ['Sobre', 'Atributos', 'Evoluções'];

const EVOLUTIONS: Record<number, Array<{ id: number; name: string; level: number }>> = {
  25:  [{ id: 172, name: 'Pichu', level: 0 }, { id: 25, name: 'Pikachu', level: 1 }, { id: 26, name: 'Raichu', level: 22 }],
  4:   [{ id: 4,   name: 'Charmander', level: 0 }, { id: 5, name: 'Charmeleon', level: 16 }, { id: 6, name: 'Charizard', level: 36 }],
  7:   [{ id: 7,   name: 'Squirtle', level: 0 }, { id: 8, name: 'Wartortle', level: 16 }, { id: 9, name: 'Blastoise', level: 36 }],
  1:   [{ id: 1,   name: 'Bulbasaur', level: 0 }, { id: 2, name: 'Ivysaur', level: 16 }, { id: 3, name: 'Venusaur', level: 32 }],
  94:  [{ id: 92,  name: 'Gastly', level: 0 }, { id: 93, name: 'Haunter', level: 25 }, { id: 94, name: 'Gengar', level: 0 }],
  133: [{ id: 133, name: 'Eevee', level: 0 }],
};

export default function DetailScreen({ route, navigation }: any) {
  const { pokemonId } = route.params;
  const pokemon = POKEMON_LIST.find(p => p.id === pokemonId) ?? POKEMON_LIST[0];
  const [tab, setTab] = useState(0);
  const [fav, setFav] = useState(false);
  const heroAnim = useRef(new Animated.Value(0)).current;
  const spriteAnim = useRef(new Animated.Value(0)).current;
  const c = TYPE_COLORS[pokemon.types[0]] ?? TYPE_COLORS.normal;
  const evos = EVOLUTIONS[pokemon.id] ?? [];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(spriteAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  const stats = [pokemon.hp, pokemon.atk, pokemon.def, pokemon.spa, pokemon.spd, pokemon.spe];

  return (
    <View style={styles.container}>
      {/* ── Hero ── */}
      <View style={styles.hero}>
        <LinearGradient
          colors={['#1a1000', '#2a1f00', '#1a0f00']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
        {/* Glow */}
        <View style={[styles.heroGlow, { backgroundColor: c.text }]} />

        {/* Circles */}
        {[320, 220, 130].map(s => (
          <View key={s} style={[styles.heroCircle, { width: s, height: s, borderRadius: s / 2, right: -s / 3, top: -s / 3 }]} />
        ))}

        <SafeAreaView edges={['top']} style={styles.heroNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.navBtnText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setFav(f => !f)}>
            <Text style={styles.navBtnText}>{fav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Sprite */}
        <Animated.Image
          source={{ uri: ARTWORK_URL(pokemon.id) }}
          style={[
            styles.heroSprite,
            {
              transform: [
                { scale: spriteAnim },
                { translateY: spriteAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
              ],
              opacity: spriteAnim,
            },
          ]}
        />

        {/* Hero Text */}
        <Animated.View style={[styles.heroText, { opacity: heroAnim, transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Text style={styles.heroNum}>#{String(pokemon.id).padStart(3, '0')} · Pokémon</Text>
          <Text style={styles.heroName}>{pokemon.name}</Text>
          <View style={styles.heroBadges}>
            {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
          </View>
        </Animated.View>
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>
        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === i && styles.tabActive]}
              onPress={() => setTab(i)}
            >
              <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {tab === 0 && (
            <View style={styles.aboutSection}>
              <InfoRow label="Peso" value={pokemon.weight} />
              <InfoRow label="Altura" value={pokemon.height} />
              <InfoRow label="Habilidade" value="Static · Coragem" />
              <InfoRow label="Descrição" value="Quando encontra inimigos, libera descargas elétricas de alta tensão de suas bochechas vermelho-vivas." isDesc />
            </View>
          )}

          {tab === 1 && (
            <View style={styles.aboutSection}>
              <StatBars stats={stats} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalVal}>{stats.reduce((a, b) => a + b, 0)}</Text>
              </View>
            </View>
          )}

          {tab === 2 && (
            <View style={styles.evoChain}>
              {evos.map((evo, i) => (
                <View key={evo.id} style={styles.evoItem}>
                  {i > 0 && (
                    <View style={styles.evoArrow}>
                      <Text style={styles.evoArrowText}>↓</Text>
                      {evo.level > 0 && <Text style={styles.evoLevel}>Nível {evo.level}</Text>}
                      {evo.level === 0 && i === 1 && <Text style={styles.evoLevel}>Amizade</Text>}
                    </View>
                  )}
                  <View style={[styles.evoCard, evo.id === pokemon.id && styles.evoCardActive]}>
                    <Image source={{ uri: SPRITE_URL(evo.id) }} style={styles.evoSprite} />
                    <Text style={styles.evoName}>{evo.name}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function InfoRow({ label, value, isDesc }: { label: string; value: string; isDesc?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoVal, isDesc && styles.infoValDesc]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // Hero
  hero: { height: 360, position: 'relative', overflow: 'hidden', justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 28 },
  heroGlow: { position: 'absolute', width: 300, height: 300, borderRadius: 150, top: 20, right: -40, opacity: 0.2 },
  heroCircle: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,217,61,0.1)' },
  heroNav: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, zIndex: 10 },
  navBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnText: { fontSize: 18, color: 'white' },
  heroSprite: {
    position: 'absolute', right: 10, bottom: 40,
    width: 180, height: 180,
    resizeMode: 'contain',
  },
  heroText: { position: 'relative', zIndex: 2 },
  heroNum: { fontSize: 12, fontWeight: '700', color: 'rgba(255,217,61,0.7)', letterSpacing: 3, marginBottom: 4 },
  heroName: { fontSize: 36, fontWeight: '900', color: 'white', lineHeight: 40, marginBottom: 10 },
  heroBadges: { flexDirection: 'row', gap: 8 },

  // Body
  body: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 24,
    marginTop: -20,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20, marginBottom: 24,
    backgroundColor: Colors.surface2,
    borderRadius: 12, padding: 4, gap: 2,
  },
  tab: { flex: 1, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: Colors.yellow },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  tabTextActive: { color: '#333' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },

  // About
  aboutSection: { gap: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  infoLabel: { width: 80, fontSize: 13, fontWeight: '600', color: Colors.textMuted, paddingTop: 2 },
  infoVal: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.text },
  infoValDesc: { fontWeight: '400', color: 'rgba(240,240,255,0.7)', lineHeight: 22, fontSize: 13 },

  // Stats
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 8, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  totalLabel: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  totalVal: { fontSize: 18, fontWeight: '900', color: Colors.yellow },

  // Evolutions
  evoChain: { alignItems: 'center', gap: 0, paddingTop: 8 },
  evoItem: { alignItems: 'center' },
  evoArrow: { alignItems: 'center', paddingVertical: 12, gap: 4 },
  evoArrowText: { fontSize: 24, color: Colors.textMuted },
  evoLevel: { fontSize: 11, fontWeight: '700', color: Colors.yellow, letterSpacing: 1 },
  evoCard: {
    width: 120, padding: 16, borderRadius: 20,
    backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', gap: 8,
  },
  evoCardActive: { borderColor: Colors.yellow, backgroundColor: 'rgba(255,217,61,0.08)' },
  evoSprite: { width: 72, height: 72, resizeMode: 'contain' },
  evoName: { fontSize: 13, fontWeight: '800', color: Colors.text },
});
