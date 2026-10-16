import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ListingCard } from "../components/ListingCard";
import { categories } from "../data";
import { theme } from "../theme";
import { Listing, PriceFilter, SortOption } from "../types";

export function ExplorePage({
  items,
  query,
  category,
  priceFilter,
  sortBy,
  savedIds,
  onQueryChange,
  onCategoryChange,
  onPriceFilterChange,
  onSortByChange,
  onSave,
  onOpen,
  onProfile,
  onRefresh,
  mongoConnected,
}: {
  items: Listing[];
  query: string;
  category: string;
  priceFilter: PriceFilter;
  sortBy: SortOption;
  savedIds: string[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriceFilterChange: (value: PriceFilter) => void;
  onSortByChange: (value: SortOption) => void;
  onSave: (id: string) => void;
  onOpen: (item: Listing) => void;
  onProfile: () => void;
  onRefresh?: () => void;
  mongoConnected?: boolean;
}) {
  const priceOptions: { id: PriceFilter; label: string }[] = [
    { id: "all", label: "All Prices" },
    { id: "under25", label: "< Rs. 2,500" },
    { id: "25to50", label: "Rs. 2,500 - 5,000" },
    { id: "50to100", label: "Rs. 5,000 - 10,000" },
    { id: "100plus", label: "Rs. 10,000+" },
  ];

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: "newest", label: "Newest" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
  ];

  const hasActiveFilter =
    query.trim().length > 0 || category !== "All items" || priceFilter !== "all" || sortBy !== "newest";

  const clearFilters = () => {
    onQueryChange("");
    onCategoryChange("All items");
    onPriceFilterChange("all");
    onSortByChange("newest");
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Top Header with Clean Logo */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.universityName}>University of Jaffna</Text>
            <Text style={styles.brandTitle}>Campus Marketplace</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {onRefresh && (
            <Pressable
              style={[
                styles.syncBadge,
                mongoConnected ? styles.syncBadgeConnected : styles.syncBadgeDisconnected,
              ]}
              onPress={onRefresh}
              accessibilityLabel="Sync with MongoDB"
            >
              <Text style={styles.syncBadgeDot}>{mongoConnected ? "🟢" : "🔴"}</Text>
              <Text
                style={[
                  styles.syncBadgeText,
                  mongoConnected ? styles.syncTextConnected : styles.syncTextDisconnected,
                ]}
              >
                {mongoConnected ? "Live" : "Offline"}
              </Text>
            </Pressable>
          )}
          <Pressable style={styles.avatarBtn} onPress={onProfile}>
            <Text style={styles.avatarIcon}>👤</Text>
          </Pressable>
        </View>
      </View>

      {/* Simple Search Input */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search textbooks, headphones, desk..."
          placeholderTextColor={theme.colors.textDim}
          style={styles.searchInput}
        />
        {query.length > 0 && (
          <Pressable onPress={() => onQueryChange("")} style={styles.clearSearchBtn}>
            <Text style={styles.clearSearchText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((val) => {
          const isActive = category === val;
          return (
            <Pressable
              key={val}
              onPress={() => onCategoryChange(val)}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                {val}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Price Range Filter Pills */}
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Price:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priceScroll}
        >
          {priceOptions.map((opt) => {
            const isActive = priceFilter === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => onPriceFilterChange(opt.id)}
                style={[styles.priceChip, isActive && styles.priceChipActive]}
              >
                <Text style={[styles.priceChipText, isActive && styles.priceChipTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Results Header & Sort */}
      <View style={styles.feedHeader}>
        <Text style={styles.resultsCount}>{items.length} items available</Text>
        <View style={styles.sortRow}>
          {sortOptions.map((opt) => {
            const isActive = sortBy === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => onSortByChange(opt.id)}
                style={[styles.sortBtn, isActive && styles.sortBtnActive]}
              >
                <Text style={[styles.sortBtnText, isActive && styles.sortBtnTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Clear filter indicator */}
      {hasActiveFilter && (
        <View style={styles.activeFilterBar}>
          <Text style={styles.activeFilterText}>Filtered search</Text>
          <Pressable onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Reset filters ✕</Text>
          </Pressable>
        </View>
      )}

      {/* Listings Grid */}
      <FlatList
        data={items}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyMsg}>
              No listings matched your search. Try changing the category or clearing the search bar.
            </Text>
            <Pressable style={styles.clearAllBtn} onPress={clearFilters}>
              <Text style={styles.clearAllText}>Clear All Filters</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            saved={savedIds.includes(item.id)}
            onSave={() => onSave(item.id)}
            onOpen={() => onOpen(item)}
          />
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 14,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  universityName: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "500",
  },
  brandTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: {
    fontSize: 16,
  },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  syncBadgeConnected: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  syncBadgeDisconnected: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  syncBadgeDot: {
    fontSize: 9,
  },
  syncBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  syncTextConnected: {
    color: "#16A34A",
  },
  syncTextDisconnected: {
    color: "#DC2626",
  },
  searchBar: {
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 13,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  categoryChip: {
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  priceLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  priceScroll: {
    gap: 6,
  },
  priceChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  priceChipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  priceChipText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "500",
  },
  priceChipTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: "700",
  },
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
    gap: 6,
  },
  resultsCount: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  sortRow: {
    flexDirection: "row",
    gap: 4,
  },
  sortBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortBtnActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  sortBtnText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "500",
  },
  sortBtnTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: "700",
  },
  activeFilterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  activeFilterText: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  clearFiltersText: {
    color: theme.colors.red,
    fontSize: 11,
    fontWeight: "600",
  },
  grid: {
    gap: 12,
  },
  columns: {
    gap: 12,
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 16,
  },
  emptyIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  emptyMsg: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 240,
    marginBottom: 14,
  },
  clearAllBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearAllText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
