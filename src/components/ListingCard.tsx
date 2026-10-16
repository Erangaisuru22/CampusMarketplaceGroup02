import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { Listing } from "../types";

export function ListingCard({
  item,
  saved,
  onSave,
  onOpen,
}: {
  item: Listing;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  const isSold = item.status === "sold";
  const isReserved = item.status === "reserved";

  return (
    <Pressable style={styles.card} onPress={onOpen}>
      <View style={styles.photoContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />

        {/* Status Pill Badge */}
        <View
          style={[
            styles.statusBadge,
            isSold
              ? styles.badgeSold
              : isReserved
              ? styles.badgeReserved
              : styles.badgeAvailable,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isSold
                ? styles.textSold
                : isReserved
                ? styles.textReserved
                : styles.textAvailable,
            ]}
          >
            {isSold ? "Sold" : isReserved ? "Reserved" : "Available"}
          </Text>
        </View>

        {/* Favorite Save Button */}
        <Pressable
          accessibilityLabel={saved ? "Remove from saved" : "Save item"}
          style={[styles.saveBtn, saved && styles.saveBtnActive]}
          onPress={(e) => {
            e.stopPropagation?.();
            onSave();
          }}
        >
          <Text style={[styles.heart, saved && styles.heartActive]}>
            {saved ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.price}>Rs. {Number(item.price).toLocaleString()}</Text>
          <Text style={styles.conditionTag}>{item.condition}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.campus} numberOfLines={1}>
          📍 {item.campus.split("-")[0]?.trim() || item.campus}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.sellerName} numberOfLines={1}>
            By {item.seller}
          </Text>
          <Text style={styles.categoryName}>{item.category}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.bgCard,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  photoContainer: {
    height: 140,
    backgroundColor: "#F1F5F9",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  badgeAvailable: {
    backgroundColor: theme.colors.greenLight,
  },
  textAvailable: {
    color: theme.colors.green,
  },
  badgeReserved: {
    backgroundColor: theme.colors.amberLight,
  },
  textReserved: {
    color: theme.colors.amber,
  },
  badgeSold: {
    backgroundColor: theme.colors.redLight,
  },
  textSold: {
    color: theme.colors.red,
  },
  saveBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  saveBtnActive: {
    backgroundColor: "#FFE4E6",
    borderColor: "#FECDD3",
  },
  heart: {
    color: "#64748B",
    fontSize: 16,
    lineHeight: 18,
  },
  heartActive: {
    color: theme.colors.red,
  },
  body: {
    padding: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  price: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  conditionTag: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  title: {
    minHeight: 34,
    color: theme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  campus: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 8,
  },
  sellerName: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    flex: 1,
  },
  categoryName: {
    color: theme.colors.textDim,
    fontSize: 10,
    fontWeight: "500",
  },
});
