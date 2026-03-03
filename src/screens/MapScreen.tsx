import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Colors, SPRITE_URL, POKEMON_LIST, TYPE_COLORS } from '../theme';
import { TypeBadge } from '../components';

const { width } = Dimensions.get('window');

type GeoPoint = { latitude: number; longitude: number };

const MAP_POKEMON = [
  { id: 25, top: '46%', left: '42%', active: true,  latOffset: 0.0008, lonOffset: 0.0004 },
  { id: 7,  top: '26%', left: '18%', active: false, latOffset: -0.0011, lonOffset: -0.0007 },
  { id: 4,  top: '26%', left: '68%', active: false, latOffset: -0.0006, lonOffset: 0.0013 },
  { id: 1,  top: '65%', left: '76%', active: false, latOffset: 0.0012, lonOffset: 0.0011 },
];

const WEB_DEFAULT_LOCATION: GeoPoint = {
  latitude: -23.55052,
  longitude: -46.633308,
};

function distanceMeters(a: GeoPoint, b: GeoPoint) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

function FloatingMarker({
  pokemon,
  delay,
  onPress,
}: {
  pokemon: { id: number; top: string; left: string; active: boolean };
  delay: number;
  onPress: () => void;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: -8, duration: 1500, useNativeDriver: true, delay }),
        Animated.timing(anim, { toValue: 0,  duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [anim, delay]);

  return (
    <Animated.View
      style={[
        styles.markerWrap,
        { top: pokemon.top, left: pokemon.left },
        { transform: [{ translateY: anim }] },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.markerBubble, pokemon.active && styles.markerBubbleActive]}>
          <Image source={{ uri: SPRITE_URL(pokemon.id) }} style={styles.markerSprite} />
        </View>
        <View style={styles.markerPin} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function RadarRing({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    ).start();
  }, [anim, delay]);

  const scale  = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 3] });
  const opacity= anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 0.3, 0] });

  return (
    <Animated.View
      style={[styles.radarRing, { transform: [{ scale }], opacity }]}
    />
  );
}

const FILTERS = ['⚡ Todos', '🔥 Fogo', '💧 Água', '🌿 Planta'];

export default function MapScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = React.useState(0);
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'denied'>('loading');
  const [userLocation, setUserLocation] = React.useState<GeoPoint | null>(null);
  const [selectedPokemonId, setSelectedPokemonId] = React.useState(25);

  const loadUserLocation = useCallback(async () => {
    try {
      setStatus('loading');
      const { status: permission } = await Location.requestForegroundPermissionsAsync();
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      setStatus('ready');
    } catch {
      setStatus('denied');
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      await loadUserLocation();

      const { status: permission } = await Location.getForegroundPermissionsAsync();
      if (permission !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 8,
          timeInterval: 5000,
        },
        (loc) => {
          if (!mounted) return;
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          setStatus('ready');
        }
      );
    })();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, [loadUserLocation]);

  const locationAnchor = userLocation ?? WEB_DEFAULT_LOCATION;

  const geoPokemon = useMemo(
    () => MAP_POKEMON.map((p) => ({
      ...p,
      coordinate: {
        latitude: locationAnchor.latitude + p.latOffset,
        longitude: locationAnchor.longitude + p.lonOffset,
      },
    })),
    [locationAnchor.latitude, locationAnchor.longitude]
  );

  const selectedEntry = geoPokemon.find((p) => p.id === selectedPokemonId) ?? geoPokemon[0];
  const selectedPokemon = POKEMON_LIST.find((p) => p.id === selectedEntry.id) ?? POKEMON_LIST[0];

  const selectedDistance = userLocation
    ? `${Math.round(distanceMeters(userLocation, selectedEntry.coordinate))}m`
    : '—';

  const locationText =
    status === 'denied'
      ? 'Permissão de localização negada'
      : userLocation
        ? `${userLocation.latitude.toFixed(5)}, ${userLocation.longitude.toFixed(5)}`
        : 'Obtendo localização...';

  return (
    <View style={styles.container}>
      {/* ── Map background ── */}
      <View style={styles.mapBg}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: i * 68 }]} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: i * 42 }]} />
        ))}
        <View style={[styles.roadH, { top: '35%' }]} />
        <View style={[styles.roadH, { top: '62%' }]} />
        <View style={[styles.roadV, { left: '27%' }]} />
        <View style={[styles.roadV, { left: '62%' }]} />
        <View style={[styles.block, { top: '15%', left: '30%', width: 90, height: 70 }]} />
        <View style={[styles.block, { top: '15%', left: '64%', width: 60, height: 70 }]} />
        <View style={[styles.block, { top: '38%', left: '30%', width: 90, height: 60 }]} />
        <View style={[styles.block, { top: '38%', left: '64%', width: 60, height: 60 }]} />
        <View style={[styles.park,  { top: '39%', left: '5%',  width: 60, height: 80 }]} />
        <View style={[styles.block, { top: '65%', left: '5%',  width: 60, height: 65 }]} />
        <View style={[styles.block, { top: '65%', left: '30%', width: 90, height: 65 }]} />
      </View>

      <View style={styles.radarCenter}>
        <RadarRing delay={0} />
        <RadarRing delay={800} />
        <RadarRing delay={1600} />
      </View>

      {geoPokemon.map((p, i) => (
        <FloatingMarker
          key={p.id}
          pokemon={p}
          delay={i * 400}
          onPress={() => {
            setSelectedPokemonId(p.id);
            navigation.navigate('Detail', { pokemonId: p.id });
          }}
        />
      ))}

      {/* ── Status Bar ── */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>{locationText}</Text>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((f, i) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, activeFilter === i && styles.chipActive]}
              onPress={() => setActiveFilter(i)}
            >
              <Text style={[styles.chipText, activeFilter === i && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* ── FABs ── */}
      <View style={styles.fabs}>
        <TouchableOpacity style={[styles.fab, { backgroundColor: Colors.yellow }]} onPress={loadUserLocation}>
          <Text>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab}><Text style={styles.fabText}>＋</Text></TouchableOpacity>
        <TouchableOpacity style={styles.fab}><Text style={styles.fabText}>－</Text></TouchableOpacity>
      </View>

      {/* ── Bottom Sheet ── */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <View style={styles.sheetAvatar}>
            <Image source={{ uri: SPRITE_URL(selectedPokemon.id) }} style={styles.sheetSprite} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sheetNum}>#{String(selectedPokemon.id).padStart(3, '0')}</Text>
            <Text style={styles.sheetName}>{selectedPokemon.name}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
              {selectedPokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[[selectedPokemon.weight, 'Peso'], [selectedPokemon.height, 'Altura'], [selectedDistance, 'Distância']].map(([val, label]) => (
            <View key={label} style={styles.statBox}>
              <Text style={styles.statBoxVal}>{val}</Text>
              <Text style={styles.statBoxLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.catchBtn}
          onPress={() => navigation.navigate('Detail', { pokemonId: selectedPokemon.id })}
        >
          <Text style={styles.catchBtnText}>⚡ Capturar Pokémon</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  safeArea: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, paddingHorizontal: 16 },

  // Map
  mapBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1a2035' },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(60,80,140,0.15)' },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(60,80,140,0.15)' },
  roadH: { position: 'absolute', left: 0, right: 0, height: 20, backgroundColor: '#252a40' },
  roadV: { position: 'absolute', top: 0, bottom: 0, width: 18, backgroundColor: '#252a40' },
  block: { position: 'absolute', backgroundColor: 'rgba(30,40,70,0.7)', borderRadius: 6 },
  park:  { position: 'absolute', backgroundColor: 'rgba(46,213,115,0.08)', borderWidth: 1, borderColor: 'rgba(46,213,115,0.15)', borderRadius: 10 },

  // Radar
  radarCenter: {
    position: 'absolute',
    top: '46%', left: '42%',
    width: 1, height: 1,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 4,
  },
  radarRing: {
    position: 'absolute',
    width: 60, height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255,217,61,0.4)',
  },

  // Markers
  markerWrap: { position: 'absolute', alignItems: 'center', zIndex: 5 },
  markerBubble: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'white',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
    elevation: 8,
  },
  markerBubbleActive: {
    shadowColor: Colors.yellow, shadowOpacity: 0.8, shadowRadius: 16,
    borderWidth: 3, borderColor: Colors.yellow,
  },
  markerSprite: { width: 38, height: 38 },
  markerPin: { width: 2, height: 10, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 1, marginTop: 1 },

  // Search
  searchBar: {
    marginTop: 8,
    height: 52, backgroundColor: 'rgba(20,20,35,0.92)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, gap: 10, marginBottom: 10,
  },
  searchIcon: { fontSize: 18 },
  searchText: { color: Colors.textMuted, fontSize: 15, fontWeight: '600' },

  // Filters
  filters: { gap: 8, paddingBottom: 4 },
  chip: {
    height: 32, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: 'rgba(20,20,35,0.9)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  chipActive: { backgroundColor: Colors.yellow, borderColor: Colors.yellow },
  chipText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  chipTextActive: { color: '#333' },

  // FABs
  fabs: { position: 'absolute', right: 16, bottom: 280, gap: 12, zIndex: 20 },
  fab: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(20,20,35,0.92)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  fabText: { fontSize: 22, color: Colors.text, fontWeight: '700' },

  // Bottom Sheet
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: Colors.border,
    zIndex: 30,
  },
  sheetHandle: { width: 36, height: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, alignSelf: 'center', marginTop: 14, marginBottom: 20 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  sheetAvatar: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: 'rgba(255,217,61,0.1)', borderWidth: 1, borderColor: 'rgba(255,217,61,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  sheetSprite: { width: 64, height: 64 },
  sheetNum: { fontSize: 11, fontWeight: '700', color: Colors.yellow, letterSpacing: 2 },
  sheetName: { fontSize: 26, fontWeight: '900', color: Colors.text, lineHeight: 30, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: Colors.surface2, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statBoxVal: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statBoxLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
  catchBtn: {
    height: 52, backgroundColor: Colors.yellow, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  catchBtnText: { fontSize: 16, fontWeight: '800', color: '#1a1400', letterSpacing: 0.5 },
});
