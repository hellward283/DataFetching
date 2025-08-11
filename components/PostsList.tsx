import { useRouter } from "expo-router";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { Post } from "../types/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const CARD_WIDTH = (SCREEN_WIDTH - 36) / 2;
const CARD_IMAGE_HEIGHT = Math.round(SCREEN_HEIGHT * 0.18);



interface PostsListProps {
  searchQuery?: string;
  posts: Post[];
  onEndReached?: () => void;
  loading?: boolean;
}

export default function PostsList({ searchQuery, posts, onEndReached, loading }: PostsListProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = {
    background: "#add8e6",
    card: isDark ? "#5e2750" : "#fff0f6",
    text: isDark ? "#ffe4ec" : "#d72660",
    border: "#f7a1c4",
    price: isDark ? "#ffb3d9" : "#d72660",
    discount: isDark ? "#ff69b4" : "#ff69b4",
    rating: isDark ? "#ffb3d9" : "#d72660",
    category: isDark ? "#f7a1c4" : "#d72660",
  };
  const filteredPosts = searchQuery
    ? posts.filter((post) =>
        post.title.toLowerCase().includes((searchQuery || "").toLowerCase())
      )
    : posts;

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => {
    
        const { id, ...rest } = item;
        router.push({ pathname: '/product/[id]', params: { id: id.toString(), ...rest } });
      }}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.description}>{item.description}</Text>

      <View style={styles.detailGroup}>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.discount}>-{item.discountPercentage}%</Text>
      </View>

      <View style={styles.ratingCategory}>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }] }>
      <Text style={[styles.header, { color: theme.text }]}>Product List</Text>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
            activeOpacity={0.8}
            onPress={() => {
              const { id, ...rest } = item;
              router.push({ pathname: '/product/[id]', params: { id: id.toString(), ...rest } });
            }}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.image} />
            <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            <Text numberOfLines={2} style={[styles.description, { color: theme.text + 'cc' }]}>{item.description}</Text>
            <View style={styles.detailGroup}>
              <Text style={[styles.price, { color: theme.price }]}>${item.price}</Text>
              <Text style={[styles.discount, { color: theme.discount }]}>-{item.discountPercentage}%</Text>
            </View>
            <View style={styles.ratingCategory}>
              <Text style={[styles.rating, { color: theme.rating }]}>⭐ {item.rating}</Text>
              <Text style={[styles.category, { color: theme.category }]}>{item.category}</Text>
            </View>
          </TouchableOpacity>
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: theme.text }}>No products found.</Text>}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text style={{ textAlign: 'center', padding: 10, color: theme.text }}>Loading more products...</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: "#add8e6",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    borderRadius: 14,
    padding: 10,
    width: CARD_WIDTH,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: "cover",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    marginBottom: 8,
  },
  detailGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
  },
  discount: {
    fontSize: 12,
    fontWeight: "600",
  },
  ratingCategory: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rating: {
    fontSize: 12,
  },
  category: {
    fontSize: 12,
  },
});
