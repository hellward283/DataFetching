import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { DataContext } from "../context/DataContext"; // Accessing data context
import { Product } from "../types/types"; // Import Product type

export default function PostsList() {
  const { products, setProducts } = useContext(DataContext); // Get products and setProducts from context
  const [loading, setLoading] = useState(true); // For loading indicator
  const [error, setError] = useState<string | null>(null); // For catching errors
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Filtered list of products

  // Fetch products data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        console.log("Fetched data:", data); // Log the data to the console

        if (data && data.products) {
          setProducts(data.products); // Set products in context
          setFilteredProducts(data.products); // Initially set filtered products to all products
          setLoading(false); // Stop loading after data is fetched
        } else {
          setError("No products found.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products."); // Display error message
        setLoading(false); // Stop loading on error
      }
    };

    fetchProducts();
  }, [setProducts]); // Adding setProducts as dependency to avoid warnings

  // Filter products based on search term
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text === "") {
      setFilteredProducts(products); // Show all products when search term is cleared
    } else {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(text.toLowerCase()) // Use title instead of name
      );
      setFilteredProducts(filtered);
    }
  };

  // Render each product as a card
  const renderProduct = ({ item, index }: { item: Product; index: number }) => {
    const discountedPrice = item.price - (item.price * (item.discountPercentage / 100));
    const averageRating = item.reviews ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length : 0;

    return (
      <View style={styles.card} key={index}>
        {/* Product Image */}
        <Image 
          source={{ uri: item.image }} 
          style={styles.image} 
          resizeMode="contain" // Ensure the image is scaled within the bounds
        />

        <View style={styles.details}>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.brand}>{item.brand}</Text>
          
          {/* Price and Discounted Price */}
          <Text style={styles.price}>
            ${discountedPrice.toFixed(2)} 
            <Text style={styles.discounted}>${item.price}</Text>
          </Text>

          {/* Product Category */}
          <Text style={styles.category}>Category: {item.category}</Text>

          {/* Product Rating */}
          <Text style={styles.rating}>Rating: {averageRating.toFixed(1)} ⭐</Text>

          {/* Product Description */}
          <Text style={styles.description}>{item.description}</Text>

          {/* Stock Info */}
          <Text style={styles.stock}>Stock: {item.stock} items</Text>

          {/* Shipping and Warranty Info */}
          <Text style={styles.warranty}>Warranty: {item.warrantyInformation}</Text>
          <Text style={styles.shipping}>Shipping: {item.shippingInformation}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product List</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search products by name"
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* Show ActivityIndicator while loading */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.errorText}>No products found.</Text>
      ) : (
        <FlatList
          data={filteredProducts} // Use filtered products
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  card: {
    flexDirection: "row", // Align image and details horizontally
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: "contain",
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold", // Make product title bold
    marginBottom: 5,
  },
  brand: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: "#4CAF50", // Green for price
    marginBottom: 5,
  },
  discounted: {
    fontSize: 14,
    textDecorationLine: "line-through", // Show original price with a strike-through
    color: "#999",
  },
  category: {
    fontSize: 14,
    color: "#777", // Gray color for category
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: "#FFB400", // Gold color for rating
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555", // Gray color for description
    marginBottom: 5,
  },
  stock: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  warranty: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  shipping: {
    fontSize: 14,
    color: "#333",
  },
  loader: {
    marginTop: 30, // Position the loader properly
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
