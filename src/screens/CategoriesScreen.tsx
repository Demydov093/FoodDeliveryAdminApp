import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCategory, fetchCategories } from "../api/apiClient";

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
    onError: (error) =>
      Alert.alert("Error", `Failed to delete category ${error}`),
  });

  const handleDelete = (id: string) => {
    Alert.alert("Delete category", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  };

  const renderCategory = ({ item }: { item: Category }) => (
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
        <Text className="text-xs text-gray-500 mt-1">
          {item?.products?.length ?? 0} products
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
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

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-xl font-bold text-gray-900">Categories</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddCategory")}
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
      ) : categories?.length === 0 ? (
        <View className="flex-1 items-center mt-20">
          <Ionicons name="layers" size={48} color="#9CA3AF" />
          <Text className="text-lg font-semibold text-gray-800 mt-4">
            No Categories...
          </Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
};

export default CategoriesScreen;
