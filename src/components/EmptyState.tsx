import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

export function EmptyState({
  title,
  message,
  action,
  onAction,
  icon = "🛍️",
}: {
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
  icon?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.iconText}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && onAction && (
        <Pressable style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
    backgroundColor: theme.colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginVertical: 16,
  },
  iconText: {
    fontSize: 36,
    marginBottom: 12,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  message: {
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight: 19,
    fontSize: 13,
    maxWidth: 260,
  },
  button: {
    height: 42,
    marginTop: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
});
