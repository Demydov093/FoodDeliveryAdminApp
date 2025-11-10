import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const CategoriesScreen = () => {
  const navigation = useNavigation();
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
    </View>
  );
};

export default CategoriesScreen;
