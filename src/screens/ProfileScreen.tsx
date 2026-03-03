import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, SPRITE_URL, POKEMON_LIST } from '../theme';
import { BottomNav } from '../components';

const MEDALS = [
  { icon: '🥇', name: 'Capturista', tier: 'gold' },
  { icon: '⚡', name: 'Voltagem',   tier: 'gold' },
  { icon: '💧', name: 'Mergulhador',tier: 'silver' },
  { icon: '🔥', name: 'Chama',      tier: 'bronze' },
];

const MEDAL_COLORS: Record<string, string> = {
  gold:   'rgba(255,215,0,0.15)',
  silver: 'rgba(192,192,192,0.1)',
  bronze: 'rgba(205,127,50,0.1)',
};
const MEDAL_BORDERS: Record<string, string> = {
  gold:   'rgba(255,215,0,0.3)',
  silver: 'rgba(192,192,192,0.2)',
  bronze: 'rgba(205,127,50,0.2)',
};

const RECENT_CAUGHT = POKEMON_LIST.slice(0, 4);

export default function ProfileScreen({ navigation }: any) {
  const xpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(xpAnim, { toValue: 0.68, duration: 1000, delay: 300, useNativeDriver: false }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.hero}>
        <LinearGradient
          colors={['#0d1a0f', '#1a2d1b']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
        <View style={styles.heroGlow} />

        <SafeAreaView edges={['top']} style={styles.safeTop}>
          <TouchableOpacity style={styles.settingsBtn}>
            <Text style={styles.settingsBtnText}>⚙️</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Trainer info */}
        <View style={styles.trainerRow}>
          <View style={styles.trainerAvatar}>
            <Text style={styles.trainerEmoji}>🎮</Text>
          </View>
          <View style={styles.trainerInfo}>
            <Text style={styles.trainerLevel}>Treinador Ás · Nível 28</Text>
            <Text style={styles.trainerName}>AshKetchum97</Text>
            <Text style={styles.trainerCode}>Código: 1234 5678 9012</Text>
          </View>
        </View>

        {/* XP Bar */}
        <View style={styles.xpContainer}>
          <View style={styles.xpLabelRow}>
            <Text style={styles.xpLabel}>Progresso para Nível 29</Text>
            <Text style={styles.xpLabel}>6.800 / 10.000 XP</Text>
          </View>
          <View style={styles.xpBarBg}>
            <Animated.View
              style={[
                styles.xpBarFill,
                {
                  width: xpAnim.interpolate({
                    inputRange: [0, 1], outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          {[['143', 'Capturados'], ['82', 'Vistos'], ['2,4km', 'Hoje'], ['28', 'Nível']].map(([val, label]) => (
            <View key={label} style={styles.statCell}>
              <Text style={styles.statCellVal}>{val}</Text>
              <Text style={styles.statCellLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Body ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Medals */}
        <Text style={styles.sectionTitle}>🏅 Medalhas</Text>
        <View style={styles.medalsRow}>
          {MEDALS.map(m => (
            <View
              key={m.name}
              style={[styles.medal, { backgroundColor: MEDAL_COLORS[m.tier], borderColor: MEDAL_BORDERS[m.tier] }]}
            >
              <Text style={styles.medalIcon}>{m.icon}</Text>
              <Text style={styles.medalName}>{m.name}</Text>
            </View>
          ))}
        </View>

        {/* Recent catches */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>🕐 Capturas Recentes</Text>
        <View style={styles.recentRow}>
          {RECENT_CAUGHT.map(p => (
            <TouchableOpacity
              key={p.id}
              style={styles.recentCard}
              onPress={() => navigation.navigate('Detail', { pokemonId: p.id })}
              activeOpacity={0.7}
            >
              <Image source={{ uri: SPRITE_URL(p.id) }} style={styles.recentSprite} />
            </TouchableOpacity>
          ))}
          <View style={[styles.recentCard, styles.recentMore]}>
            <Text style={styles.recentMoreText}>+38</Text>
          </View>
        </View>

        {/* Activity cards */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>📊 Atividade Semanal</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityBars}>
            {[3, 7, 5, 9, 4, 11, 6].map((h, i) => (
              <View key={i} style={styles.activityBarCol}>
                <View style={[styles.activityBar, { height: h * 6, backgroundColor: i === 5 ? Colors.yellow : Colors.surface2 }]} />
                <Text style={styles.activityBarDay}>{['S','T','Q','Q','S','S','D'][i]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.activityInfo}>
            <View>
              <Text style={styles.activityBig}>45km</Text>
              <Text style={styles.activitySub}>distância total</Text>
            </View>
            <View>
              <Text style={styles.activityBig}>63</Text>
              <Text style={styles.activitySub}>capturas</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNav active="Profile" onNavigate={s => {
        if (s === 'Map') navigation.navigate('Map');
        if (s === 'Dex') navigation.navigate('Dex');
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // Hero
  hero: { position: 'relative', overflow: 'hidden', paddingHorizontal: 20, paddingBottom: 0 },
  heroGlow: {
    position: 'absolute', width: 250, height: 250, borderRadius: 125,
    backgroundColor: 'rgba(46,213,115,0.18)', top: -50, right: -50,
  },
  safeTop: { flexDirection: 'row', justifyContent: 'flex-end' },
  settingsBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  settingsBtnText: { fontSize: 18 },

  trainerRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8, marginBottom: 20 },
  trainerAvatar: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: 'rgba(46,213,115,0.2)',
    borderWidth: 2, borderColor: 'rgba(46,213,115,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  trainerEmoji: { fontSize: 36 },
  trainerInfo: { flex: 1 },
  trainerLevel: { fontSize: 11, fontWeight: '700', color: Colors.green, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  trainerName: { fontSize: 22, fontWeight: '900', color: Colors.text, marginBottom: 4 },
  trainerCode: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },

  xpContainer: { marginBottom: 20 },
  xpLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  xpLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  xpBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: Colors.green, borderRadius: 3 },

  statsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingVertical: 16, paddingHorizontal: 8,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border,
    marginHorizontal: -20,
  },
  statCell: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: Colors.border },
  statCellVal: { fontSize: 20, fontWeight: '800', color: Colors.text },
  statCellLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 },

  // Body
  body: { flex: 1, backgroundColor: Colors.surface },
  bodyContent: { padding: 20, paddingBottom: 32 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 14 },

  // Medals
  medalsRow: { flexDirection: 'row', gap: 10 },
  medal: {
    flex: 1, padding: 14, borderRadius: 16, borderWidth: 1,
    alignItems: 'center', gap: 8,
  },
  medalIcon: { fontSize: 28 },
  medalName: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },

  // Recent
  recentRow: { flexDirection: 'row', gap: 8 },
  recentCard: {
    width: 60, height: 60, borderRadius: 14,
    backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  recentSprite: { width: 44, height: 44, resizeMode: 'contain' },
  recentMore: { borderStyle: 'dashed' },
  recentMoreText: { fontSize: 12, fontWeight: '800', color: Colors.textMuted },

  // Activity
  activityCard: { backgroundColor: Colors.surface2, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.border },
  activityBars: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', height: 70, marginBottom: 16 },
  activityBarCol: { flex: 1, alignItems: 'center', gap: 6, justifyContent: 'flex-end' },
  activityBar: { width: '100%', borderRadius: 4, minHeight: 4 },
  activityBarDay: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  activityInfo: { flexDirection: 'row', justifyContent: 'space-around' },
  activityBig: { fontSize: 24, fontWeight: '900', color: Colors.text },
  activitySub: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, marginTop: 2 },
});
