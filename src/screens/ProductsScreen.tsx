import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, fetchProductsByCategory } from "../api/apiClient";

type Product = {
  id: string;
  name: string;
  price: number | string;
  imageUrl: string;
  description?: string;
};

const ProductsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { categoryId, categoryName } = (route?.params as any) ?? {
    categoryId: "",
    categoryName: "",
  };

  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ["products", categoryId],
    queryFn: () => fetchProductsByCategory(categoryId),
    enabled: !!categoryId,
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity className="bg-white rounded-xl p-4 mx-3 my-2 flex-row items-center shadow-xl">
      <Image
        className="w-14 h-14 rounded-lg mr-4 bg-gray-100"
        source={{
          uri: item.imageUrl || undefined,
        }}
      />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {item.name}
        </Text>
        <Text className="text-xs text-gray-500 mt-1 ">
          {item?.price?.toFixed(2) ?? 0} EUR
        </Text>
        <Text className="text-sm text-gray-400 mt-2">
          {item.description
            ? item.description.length > 80
              ? item.description.slice(0, 80) + "..."
              : item.description
            : "No description"}
        </Text>
      </View>

      <View className="flex-column items-center gap-2 ml-3">
        <TouchableOpacity className="p-2 rounded-md mr-2 bg-blue-50">
          <Ionicons name="pencil" size={18} color="#2563EB"></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item?.id)}
          className="p-2 rounded-md mr-2 bg-red-50"
        >
          <Ionicons name="trash" size={18} color="#BC2626"></Ionicons>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["products", categoryId] }),
    onError: (error) =>
      Alert.alert("Error", `Failed to delete product ${error}`),
  });

  const handleDelete = (id: string) => {
    Alert.alert("Delete product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-xl font-bold text-gray-900">
          {categoryName ? `${categoryName} products` : `Products`}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddProduct", { categoryId })}
          className="flex-row items-center bg-blue-600 px-3 py-2 rounded-lg gap-2"
        >
          <Ionicons name="add-circle" size={18} color="#fff" />
          <Text className="text-white font-semibold">Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      ) : products?.length === 0 ? (
        <View className="flex-1 items-center mt-20">
          <Ionicons name="layers" size={48} color="#9CA3AF" />
          <Text className="text-lg font-semibold text-gray-800 mt-4">
            No Products yet...
          </Text>
        </View>
      ) : (
        <FlatList
          data={products ?? []}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
};

export default ProductsScreen;
