import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, POKEMON_LIST } from '../theme';
import { PokeListItem, BottomNav } from '../components';

const TYPE_FILTERS = [
  { label: 'Todos', key: null },
  { label: '⚡', key: 'electric' },
  { label: '🔥', key: 'fire' },
  { label: '💧', key: 'water' },
  { label: '🌿', key: 'grass' },
  { label: '🔮', key: 'ghost' },
];

export default function DexScreen({ navigation }: any) {
  const [query, setQuery]         = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filtered = POKEMON_LIST.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(query.toLowerCase());
    const typeMatch = !typeFilter || p.types.includes(typeFilter);
    return nameMatch && typeMatch;
  });

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Pokédex</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{filtered.length} próximos</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar Pokémon..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Type chips */}
        <View style={styles.typeFilters}>
          {TYPE_FILTERS.map(tf => {
            const active = typeFilter === tf.key;
            return (
              <TouchableOpacity
                key={tf.label}
                style={[styles.typeChip, active && styles.typeChipActive]}
                onPress={() => setTypeFilter(active ? null : tf.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                  {tf.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={p => String(p.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>Nenhum Pokémon encontrado</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PokeListItem
            pokemon={item}
            onPress={() => navigation.navigate('Detail', { pokemonId: item.id })}
          />
        )}
      />

      <BottomNav active="Dex" onNavigate={s => {
        if (s === 'Map') navigation.navigate('Map');
        if (s === 'Profile') navigation.navigate('Profile');
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.text },
  countPill: {
    backgroundColor: Colors.surface2,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
  },
  countText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },

  searchBar: {
    height: 44, backgroundColor: Colors.surface2,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, gap: 10, marginBottom: 12,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text, fontWeight: '600' },
  clearBtn: { color: Colors.textMuted, fontSize: 16, paddingHorizontal: 4 },

  typeFilters: { flexDirection: 'row', gap: 8 },
  typeChip: {
    paddingHorizontal: 14, height: 30, borderRadius: 20,
    backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  typeChipActive: { backgroundColor: Colors.yellow, borderColor: Colors.yellow },
  typeChipText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  typeChipTextActive: { color: '#333' },

  list: { padding: 16 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, fontWeight: '600', color: Colors.textMuted },
});
