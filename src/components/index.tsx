import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, TYPE_COLORS, TYPE_EMOJIS, SPRITE_URL } from '../theme';

/* ─── TypeBadge ─────────────────────────────────────────── */
export function TypeBadge({ type, size = 'md' }: { type: string; size?: 'sm' | 'md' }) {
  const c = TYPE_COLORS[type] ?? TYPE_COLORS.normal;
  const small = size === 'sm';
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }, small && styles.badgeSm]}>
      <Text style={[styles.badgeText, { color: c.text }, small && styles.badgeTextSm]}>
        {TYPE_EMOJIS[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
    </View>
  );
}

/* ─── StatBar ────────────────────────────────────────────── */
const STAT_COLORS = ['#FF4757','#FFA502','#FFD93D','#2ED573','#1E90FF','#A55EEA'];
const STAT_LABELS = ['HP','ATK','DEF','SpA','SpD','SPD'];

export function StatBars({ stats }: { stats: number[] }) {
  return (
    <View style={styles.statsContainer}>
      {stats.map((val, i) => (
        <View key={i} style={styles.statRow}>
          <Text style={styles.statLabel}>{STAT_LABELS[i]}</Text>
          <Text style={styles.statNum}>{val}</Text>
          <View style={styles.statBarBg}>
            <View style={[styles.statBarFill, { width: `${Math.round(val / 160 * 100)}%`, backgroundColor: STAT_COLORS[i] }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

/* ─── PokéCard row (Pokédex list item) ───────────────────── */
export function PokeListItem({
  pokemon,
  onPress,
}: {
  pokemon: { id: number; name: string; types: string[]; dist: string };
  onPress: () => void;
}) {
  const mainType = pokemon.types[0];
  const c = TYPE_COLORS[mainType] ?? TYPE_COLORS.normal;
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.listGlow, { backgroundColor: c.text }]} />
      <Image source={{ uri: SPRITE_URL(pokemon.id) }} style={styles.listSprite} />
      <View style={styles.listInfo}>
        <Text style={styles.listNum}>#{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={styles.listName}>{pokemon.name}</Text>
        <View style={styles.listBadges}>
          {pokemon.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
        </View>
      </View>
      <Text style={styles.listDist}>{pokemon.dist}</Text>
      <Text style={styles.listArrow}>›</Text>
    </TouchableOpacity>
  );
}

/* ─── BottomNavBar ───────────────────────────────────────── */
export function BottomNav({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (s: string) => void;
}) {
  const items = [
    { key: 'Map', icon: '🗺️', label: 'Mapa' },
    { key: 'Dex', icon: '📖', label: 'Pokédex' },
  ];
  return (
    <View style={styles.navbar}>
      {items.slice(0, 2).map(item => (
        <TouchableOpacity
          key={item.key}
          style={styles.navItem}
          onPress={() => onNavigate(item.key)}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={[styles.navLabel, active === item.key && styles.navLabelActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.navCenter} onPress={() => onNavigate('Map')}>
        <Text style={{ fontSize: 24 }}>⚪</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Map')}>
        <Text style={styles.navIcon}>🎒</Text>
        <Text style={styles.navLabel}>Bag</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Profile')}>
        <Text style={styles.navIcon}>👤</Text>
        <Text style={[styles.navLabel, active === 'Profile' && styles.navLabelActive]}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Badges
  badge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1,
  },
  badgeSm: { paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  badgeTextSm: { fontSize: 10 },

  // Stat bars
  statsContainer: { gap: 10 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statLabel: { width: 36, fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  statNum: { width: 30, fontSize: 14, fontWeight: '800', color: Colors.text, textAlign: 'right' },
  statBarBg: { flex: 1, height: 6, backgroundColor: Colors.surface2, borderRadius: 3, overflow: 'hidden' },
  statBarFill: { height: '100%', borderRadius: 3 },

  // List item
  listItem: {
    height: 76, backgroundColor: Colors.surface,
    borderRadius: 18, borderWidth: 1, borderColor: Colors.border,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, gap: 14,
    overflow: 'hidden', position: 'relative',
  },
  listGlow: {
    position: 'absolute', right: -10, top: '10%',
    width: 80, height: 80, borderRadius: 40, opacity: 0.07,
  },
  listSprite: { width: 52, height: 52 },
  listInfo: { flex: 1 },
  listNum: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 2, marginBottom: 2 },
  listName: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 5 },
  listBadges: { flexDirection: 'row', gap: 4 },
  listDist: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  listArrow: { color: 'rgba(255,255,255,0.15)', fontSize: 18 },

  // Navbar
  navbar: {
    height: 72, backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingBottom: 8,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  navIcon: { fontSize: 22 },
  navLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: Colors.textMuted, marginTop: 3 },
  navLabelActive: { color: Colors.yellow },
  navCenter: {
    width: 56, height: 56,
    backgroundColor: Colors.yellow,
    borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: Colors.yellow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16,
    elevation: 12,
  },
});
