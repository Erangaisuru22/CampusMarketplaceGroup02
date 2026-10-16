import { useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { PageTitle } from "../components/PageTitle";
import { theme } from "../theme";
import { Listing } from "../types";

export function MyListingsPage({
  items,
  isLoggedIn = true,
  onOpen,
  onSell,
  onToggleStatus,
  onDeleteListing,
}: {
  items: Listing[];
  isLoggedIn?: boolean;
  onOpen: (item: Listing) => void;
  onSell: () => void;
  onToggleStatus: (id: string) => void;
  onDeleteListing: (id: string) => void;
}) {
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "sold">("all");

  const activeCount = items.filter((i) => i.status !== "sold").length;
  const soldCount = items.filter((i) => i.status === "sold").length;

  const displayedItems = items.filter((i) => {
    if (filterStatus === "active") return i.status !== "sold";
    if (filterStatus === "sold") return i.status === "sold";
    return true;
  });

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageTitle
        title="My Listings"
        subtitle="Manage the items you have listed on campus"
      />

      {/* Seller Summary Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{activeCount}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: theme.colors.green }]}>{soldCount}</Text>
          <Text style={styles.statLabel}>Sold</Text>
        </View>
        <View style={styles.statDivider} />
        <Pressable style={styles.sellBtn} onPress={onSell}>
          <Text style={styles.sellBtnText}>＋ Post Item</Text>
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(["all", "active", "sold"] as const).map((status) => (
          <Pressable
            key={status}
            style={[styles.filterChip, filterStatus === status && styles.filterChipActive]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[styles.filterText, filterStatus === status && styles.filterTextActive]}>
              {status === "all" ? `All (${items.length})` : status === "active" ? `Active (${activeCount})` : `Sold (${soldCount})`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Item List */}
      <FlatList
        data={displayedItems}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoggedIn ? (
            <EmptyState
              icon="🔒"
              title="Sign in required"
              message="Please sign in or register with your student account to manage your listings and post items."
              action="🔑 Sign In / Register"
              onAction={onSell}
            />
          ) : (
            <EmptyState
              icon="🏷️"
              title={filterStatus === "sold" ? "No sold items yet" : "No listings posted"}
              message="List your extra textbooks, tech gear, or supplies to help fellow students."
              action="Post an item"
              onAction={onSell}
            />
          )
        }
        renderItem={({ item }) => {
          const isSold = item.status === "sold";
          return (
            <View style={styles.itemCard}>
              <Pressable style={styles.cardHeader} onPress={() => onOpen(item)}>
                <Image source={{ uri: item.image }} style={styles.itemThumb} />
                <View style={styles.itemInfo}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.statusPill,
                        isSold ? styles.pillSold : styles.pillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          isSold ? styles.textSold : styles.textActive,
                        ]}
                      >
                        {isSold ? "Sold" : "Available"}
                      </Text>
                    </View>
                    <Text style={styles.categoryBadge}>{item.category}</Text>
                  </View>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemPrice}>Rs. {Number(item.price).toLocaleString()}</Text>
                </View>
              </Pressable>

              {/* Action Buttons: Mark as Sold & Delete */}
              <View style={styles.actionsRow}>
                <Pressable
                  style={[
                    styles.toggleStatusBtn,
                    isSold ? styles.btnReactivate : styles.btnMarkSold,
                  ]}
                  onPress={() => onToggleStatus(item.id)}
                >
                  <Text style={styles.toggleStatusText}>
                    {isSold ? "↺ Relist as Available" : "✓ Mark as Sold"}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => onDeleteListing(item.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
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
  summaryBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
  },
  sellBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sellBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  filterTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: "700",
  },
  list: {
    gap: 10,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemThumb: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  pillActive: {
    backgroundColor: theme.colors.greenLight,
  },
  textActive: {
    color: theme.colors.green,
  },
  pillSold: {
    backgroundColor: theme.colors.redLight,
  },
  textSold: {
    color: theme.colors.red,
  },
  categoryBadge: {
    color: theme.colors.textDim,
    fontSize: 10,
  },
  itemTitle: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 17,
  },
  itemPrice: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    marginTop: 10,
    gap: 8,
  },
  toggleStatusBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnMarkSold: {
    backgroundColor: theme.colors.redLight,
  },
  btnReactivate: {
    backgroundColor: theme.colors.greenLight,
  },
  toggleStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  deleteBtn: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
});
