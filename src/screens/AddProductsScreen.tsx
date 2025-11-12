import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../api/apiClient";
import { useNavigation, useRoute } from "@react-navigation/native";

type FormData = {
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
};

const AddProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { categoryId } = (route?.params as any) ?? { categoryId: "" };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "", price: 0, imageUrl: "", description: "" },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      createProduct({ ...data, price: parseFloat(data.price), categoryId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("Success creating product");
      navigation.goBack();
    },
    onError: (error) => {
      console.log("Error creating product:", error);
      Alert.alert("Error", "Failed to create  product");
    },
  });

  const onSubmit = (data: FormData) => {
    if (!data.name || !data.price || !data.imageUrl) return;
    mutation.mutate(data);
  };

  return (
    <ScrollView className="flex-1 bg-gray-20 p-4">
      <Text className="text-lg font-bold text-gray-900 mb-2">
        Add New Product
      </Text>
      <Text className="text-small text-gray-600 mb-4">
        Fill product details below
      </Text>
      <Text className="text-sm font-medium text-gray-700">Product name</Text>
      <Controller
        control={control}
        name="name"
        rules={{
          required: "Product name is required",
          minLength: { value: 2, message: "Too short" },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Type name"
            value={value}
            onChangeText={onChange}
            className="bg-white p-3 rounded-lg border border-gray-300 mt-2 py-2"
          />
        )}
      />
      {errors?.name && (
        <Text className="text-sm text-red-700">{errors.name.message}</Text>
      )}

      <Text className="text-sm font-medium text-gray-700 mt-4">Price</Text>
      <Controller
        control={control}
        name="price"
        rules={{
          required: "Price is required",
          pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid price" },
          minLength: { value: 2, message: "Too short" },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Type price"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            className="bg-white p-3 rounded-lg border border-gray-300 mt-2 py-2"
          />
        )}
      />
      {errors?.price && (
        <Text className="text-sm text-red-700">{errors.price.message}</Text>
      )}

      <Text className="text-sm font-medium text-gray-700 mt-4">imageURL</Text>
      <Controller
        control={control}
        name="imageUrl"
        rules={{
          pattern: { value: /^https?:\/\/.+/i, message: "Invalid URL" },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Give image link here"
            value={value}
            onChangeText={onChange}
            className="bg-white p-3 rounded-lg border border-gray-300 mt-2 py-2"
          />
        )}
      />
      {errors?.imageUrl && (
        <Text className="text-sm text-red-700">{errors.imageUrl.message}</Text>
      )}

      <Text className="text-sm font-medium text-gray-700 mt-4">
        Description (optional)
      </Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Type description"
            value={value}
            onChangeText={onChange}
            multiline
            className="bg-white p-3 rounded-lg border border-gray-300 mt-2 py-2"
          />
        )}
      />

      <Pressable
        onPress={handleSubmit(onSubmit)}
        className="bg-black flex-row gap-3 justify-center items-center mt-6 p-4 rounded-xl"
        disabled={mutation.status === "pending"}
      >
        <Ionicons name="save" size={18} color="#fff" />
        <Text className="text-white">Create category</Text>
      </Pressable>
    </ScrollView>
  );
};

export default AddProductScreen;
