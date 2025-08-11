import PostsList from "@/components/PostsList";
import { DataContext, DataProvider } from "@/context/DataContext";
import { Post, User } from "@/types/types";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AppContent: React.FC = () => {
  const { setPosts, setUsers } = useContext(DataContext);

  const fetchPosts = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data: Post[] = await response.json();
    setPosts(data.slice(0, 5));
  };

  const fetchUsers = async () => {
    const response = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users");
    setUsers(response.data.slice(0, 5));
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const handleReload = () => {
    fetchPosts();
    fetchUsers();
  };

  return (
    <SafeAreaView style={styles.container}>
      <PostsList />
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.customButton} onPress={handleReload}>
          <Text style={styles.buttonText}>Reload Data</Text>
        </TouchableOpacity>
      </View>
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
  buttonWrapper: {
    alignItems: "center", // centers horizontally
    marginVertical: 20,
  },
  customButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3, // shadow on Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
