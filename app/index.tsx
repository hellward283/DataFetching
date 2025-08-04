import PostsList from "@/components/PostsList";
import { DataProvider } from "@/context/DataContext";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

const AppContent: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PostsList />
    </SafeAreaView>
  );
};

export default function Index() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 40 },
});
