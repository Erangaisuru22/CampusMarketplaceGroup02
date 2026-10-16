import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { User } from "firebase/auth";
import { mongoApi } from "../api";
import { PageTitle } from "../components/PageTitle";
import { theme } from "../theme";
import { StudentUser } from "../types";

export function ProfilePage({
  user,
  studentProfile,
  isAdmin,
  savedCount,
  listingCount,
  soldCount,
  firebaseConfigured,
  mongoConnected,
  profileReady,
  error,
  onMyListings,
  onSaved,
  onOpenAdmin,
  onSignIn,
  onSignOut,
}: {
  user: User | null;
  studentProfile: StudentUser | null;
  isAdmin: boolean;
  savedCount: number;
  listingCount: number;
  soldCount: number;
  firebaseConfigured: boolean;
  mongoConnected?: boolean;
  profileReady: boolean;
  error: string;
  onMyListings: () => void;
  onSaved: () => void;
  onOpenAdmin: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const isLoggedIn = !!user || !!studentProfile;
  const name = isLoggedIn
    ? studentProfile?.fullName || user?.displayName || user?.email?.split("@")[0] || "Alex Prashan"
    : "Guest Student";
  const email = isLoggedIn
    ? studentProfile?.email || user?.email || "alex@univ.jfn.ac.lk"
    : "Not signed in";
  const studentId = isLoggedIn ? studentProfile?.studentId || "2021/CSC/015" : "GUEST";
  const faculty = isLoggedIn ? studentProfile?.faculty || "Faculty of Science" : "University of Jaffna";

  const getInitials = (fullName: string) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageTitle
        title="Profile"
        subtitle="Manage your campus account and activity"
      />

      {/* User Info Card */}
      <View style={styles.profileCard}>
        <View style={[styles.avatarCircle, !isLoggedIn && styles.avatarCircleGuest]}>
          {isLoggedIn ? (
            <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
          ) : (
            <Text style={styles.avatarGuestIcon}>👤</Text>
          )}
        </View>
        <Text style={styles.studentName}>{name}</Text>
        <Text style={styles.studentEmail}>{email}</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.studentIdBadge}>ID: {studentId}</Text>
          {isLoggedIn ? (
            isAdmin ? (
              <Text style={styles.adminRoleBadge}>🛡️ Admin</Text>
            ) : (
              <Text style={styles.studentRoleBadge}>🎓 Student</Text>
            )
          ) : (
            <Text style={styles.studentRoleBadge}>👤 Guest</Text>
          )}
        </View>
        <Text style={styles.universityBadge}>{faculty} · Uni of Jaffna</Text>
        {isLoggedIn ? (
          <View style={styles.profileActionRow}>
            <Pressable
              style={styles.cardSignOutBtn}
              onPress={onSignOut}
              accessibilityRole="button"
              accessibilityLabel="Sign out of account"
            >
              <Text style={styles.cardSignOutBtnText}>🚪 Sign Out</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.profileActionRow}>
            <Pressable
              style={styles.cardSignInBtn}
              onPress={onSignIn}
              accessibilityRole="button"
              accessibilityLabel="Sign in or register account"
            >
              <Text style={styles.cardSignInBtnText}>🔑 Sign In / Register</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <Pressable style={styles.statCard} onPress={onMyListings}>
          <Text style={styles.statValue}>{listingCount}</Text>
          <Text style={styles.statTitle}>Listings</Text>
        </Pressable>

        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: theme.colors.green }]}>{soldCount}</Text>
          <Text style={styles.statTitle}>Sold</Text>
        </View>

        <Pressable style={styles.statCard} onPress={onSaved}>
          <Text style={[styles.statValue, { color: theme.colors.red }]}>{savedCount}</Text>
          <Text style={styles.statTitle}>Saved</Text>
        </Pressable>
      </View>

      {/* Database Connection Status Card */}
      <View style={[styles.dbStatusCard, mongoConnected ? styles.dbConnectedBorder : styles.dbDisconnectedBorder]}>
        <View style={styles.dbStatusHeader}>
          <View style={[styles.dbDot, mongoConnected ? styles.dbDotActive : styles.dbDotInactive]} />
          <Text style={[styles.dbStatusTitle, mongoConnected ? { color: theme.colors.green } : { color: theme.colors.red }]}>
            {mongoConnected ? "Connected to MongoDB (3NF Normalized)" : "Disconnected / Local Mock Mode"}
          </Text>
        </View>
        <Text style={styles.dbStatusHost}>
          {mongoConnected
            ? `📡 Server Host: ${mongoApi.getBaseUrl()}`
            : `⚠️ Server Host: ${mongoApi.getBaseUrl()}`}
        </Text>
        <Text style={styles.dbStatusSub}>
          {mongoConnected
            ? "🟢 Cross-device synchronization active. Posts made on any phone are saved directly to MongoDB."
            : "⚠️ If using a real phone, ensure phone and PC are on the same Wi-Fi network and backend is running."}
        </Text>
        <Pressable
          style={styles.testConnBtn}
          onPress={async () => {
            try {
              const res = await mongoApi.getStatus();
              if (res && res.status === "connected") {
                Alert.alert(
                  "🟢 Connected to MongoDB!",
                  `Server: ${res.host}\nDatabase: ${res.databaseName}\nCollections: users, listings, reports\n\nCross-device sync is ACTIVE!`,
                );
              } else {
                Alert.alert(
                  "🔴 Server Unreachable",
                  `Could not reach server at ${mongoApi.getBaseUrl()}.\n\n1. Ensure PC backend is running ('npm run server')\n2. Ensure phone and PC are connected to the same Wi-Fi.\n3. Make sure PC IP is 192.168.149.215.`,
                );
              }
            } catch {
              Alert.alert("🔴 Connection Error", "Unable to reach database server.");
            }
          }}
        >
          <Text style={styles.testConnBtnText}>🔄 Test & Reconnect Database</Text>
        </Pressable>
      </View>

      {/* Admin Action Box — ONLY visible when logged in as Admin */}
      {isAdmin && (
        <View style={[styles.adminBanner, styles.adminBannerActive]}>
          <View style={styles.adminBannerTextCol}>
            <Text style={styles.adminBannerTitle}>
              🛡️ Admin Moderation Dashboard
            </Text>
            <Text style={styles.adminBannerSubtitle}>
              You are logged in as an administrator. You have permissions to review reports and moderate users.
            </Text>
          </View>
          <Pressable
            style={[styles.adminBannerBtn, styles.adminBannerBtnActive]}
            onPress={onOpenAdmin}
          >
            <Text style={[styles.adminBannerBtnText, styles.adminBannerBtnTextActive]}>
              Open Admin
            </Text>
          </Pressable>
        </View>
      )}

      {/* Account Menu */}
      <View style={styles.menuCard}>
        {isAdmin && (
          <MenuRow
            icon="🛡️"
            label="Admin Console"
            value="Review & Reports"
            onPress={onOpenAdmin}
          />
        )}
        <MenuRow
          icon="📦"
          label="My Listings"
          value={`${listingCount} posted`}
          onPress={onMyListings}
        />
        <MenuRow
          icon="♡"
          label="Saved Items"
          value={`${savedCount} items`}
          onPress={onSaved}
        />
        <MenuRow
          icon="📍"
          label="Campus Location"
          value={faculty}
        />
        {isLoggedIn ? (
          <MenuRow
            icon="🚪"
            label="Sign Out"
            value="Log out of account"
            onPress={onSignOut}
            isDestructive
          />
        ) : (
          <MenuRow
            icon="🔑"
            label="Sign In / Register"
            value="Access student features"
            onPress={onSignIn}
          />
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
}

function MenuRow({
  icon,
  label,
  value,
  onPress,
  isDestructive,
}: {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
  isDestructive?: boolean;
}) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuRowLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={[styles.menuLabel, isDestructive && { color: theme.colors.red }]}>
          {label}
        </Text>
      </View>
      <View style={styles.menuRowRight}>
        <Text style={[styles.menuValue, isDestructive && { color: theme.colors.red }]}>
          {value}
        </Text>
        <Text style={styles.menuArrow}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 160,
    backgroundColor: theme.colors.bg,
  },
  profileActionRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },
  cardSignOutBtn: {
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FECDD3",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardSignOutBtnText: {
    color: theme.colors.red,
    fontSize: 12,
    fontWeight: "700",
  },
  cardSignInBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardSignInBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarCircleGuest: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    shadowOpacity: 0,
    elevation: 0,
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 1,
  },
  avatarGuestIcon: {
    fontSize: 32,
  },
  studentName: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  studentEmail: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  studentIdBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primaryDark,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  adminRoleBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.red,
    backgroundColor: theme.colors.redLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  studentRoleBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primary,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  universityBadge: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
  },
  adminBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 14,
    gap: 10,
  },
  adminBannerActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  adminBannerTextCol: {
    flex: 1,
  },
  adminBannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  adminBannerSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  adminBannerBtn: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  adminBannerBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  adminBannerBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
  adminBannerBtnTextActive: {
    color: "#FFFFFF",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  statTitle: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 14,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuIcon: {
    fontSize: 15,
  },
  menuLabel: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "500",
  },
  menuRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuValue: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  menuArrow: {
    color: theme.colors.textDim,
    fontSize: 16,
  },
  errorText: {
    color: theme.colors.red,
    fontSize: 11,
    marginTop: 10,
    textAlign: "center",
  },
  dbStatusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  dbConnectedBorder: {
    borderColor: "#A7F3D0",
    backgroundColor: "#F0FDF4",
  },
  dbDisconnectedBorder: {
    borderColor: "#FECDD3",
    backgroundColor: "#FFF1F2",
  },
  dbStatusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  dbDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dbDotActive: {
    backgroundColor: "#16A34A",
  },
  dbDotInactive: {
    backgroundColor: "#E11D48",
  },
  dbStatusTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  dbStatusHost: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  dbStatusSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    lineHeight: 16,
    marginBottom: 8,
  },
  testConnBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  testConnBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
});
