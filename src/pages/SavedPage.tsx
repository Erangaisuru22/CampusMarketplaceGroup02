import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { ListingCard } from "../components/ListingCard";
import { PageTitle } from "../components/PageTitle";
import { theme } from "../theme";
import { Listing } from "../types";

export function SavedPage({
  items,
  isLoggedIn = true,
  onSave,
  onOpen,
  onClearAll,
  onBrowse,
  onSignIn,
}: {
  items: Listing[];
  isLoggedIn?: boolean;
  onSave: (id: string) => void;
  onOpen: (item: Listing) => void;
  onClearAll: () => void;
  onBrowse: () => void;
  onSignIn?: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <PageTitle
          title="Saved Items"
          subtitle="Items you have bookmarked to check later"
        />
        {items.length > 0 && (
          <Pressable style={styles.clearBtn} onPress={onClearAll}>
            <Text style={styles.clearText}>Clear all</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={items}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          !isLoggedIn ? (
            <EmptyState
              icon="🔒"
              title="Sign in required"
              message="Please sign in or register with your university account to view and save items."
              action="🔑 Sign In / Register"
              onAction={onSignIn || onBrowse}
            />
          ) : (
            <EmptyState
              icon="♡"
              title="Nothing saved yet"
              message="Tap the heart on any book or item in the explore feed to save it here."
              action="Browse listings"
              onAction={onBrowse}
            />
          )
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            saved
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  clearBtn: {
    marginTop: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  clearText: {
    color: theme.colors.red,
    fontSize: 11,
    fontWeight: "600",
  },
  columns: {
    gap: 12,
  },
  grid: {
    gap: 12,
  },
});
