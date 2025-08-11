import PostsList from "@/components/PostsList";
import { DataContext, DataProvider } from "@/context/DataContext";
import { Post } from "@/types/types";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";

const lightTheme = {
  background: "#ffe4ec", 
  card: "#f1f0ffff",     
  text: "#2926d7ff",      
  input: "#f1f0ffff",
  border: "#b4a1f7ff",     
  button: "#af69ffff",    
  buttonText: "#ffffffff",
  loadingText: "#2926d7ff",
};
const darkTheme = {
  background: "#261c3aff", 
  card: "#36275eff",      
  text: "#ffe4ec",     
  input: "#38275eff",
  border: "#aaa1f7ff",
  button: "#7369ffff",
  buttonText: "#ffffffff",
  loadingText: "#9e69ffff",
};

const AppContent: React.FC = () => {
  const { posts, setPosts } = useContext(DataContext);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://dummyjson.com/products");
      const json = await response.json();
      const products: Post[] = json.products;
      setPosts(products.slice(0, 30));
    } catch (error: any) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleReload = () => {
    fetchPosts();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <TextInput
        style={[styles.searchBar, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
        placeholder="Search products..."
        placeholderTextColor={theme.text + '99'}
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {error && (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{error}</Text>
      )}
      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={theme.button} />
          <Text style={[styles.loadingText, { color: theme.loadingText }]}>Wait Lang...</Text>
        </View>
      ) : (
        <PostsList searchQuery={search} posts={posts} />
      )}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={[styles.customButton, { backgroundColor: theme.button }]} onPress={handleReload}>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Reload Data</Text>
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
  container: { flex: 1, paddingTop: 24 },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  buttonWrapper: {
    alignItems: "center", 
    marginVertical: 20,
  },
  customButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
