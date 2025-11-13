import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategory, updateCategory } from "../api/apiClient";

type FormData = {
  name: string;
  imageUrl?: string;
};

const EditCategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { categoryId } = route.params;
  const queryClient = useQueryClient();

  const {
    data: category,
    isLoading,
    isFetching,
    status,
    error,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => fetchCategory(categoryId),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: { name: "", imageUrl: "" },
  });

  console.log("EditCategoryScreen route params:", route.params);

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("imageUrl", category.imageUrl || "");
    }
  }, [category, setValue]);

  const mutation = useMutation({
    mutationFn: ({ name, imageUrl }: FormData) =>
      updateCategory(categoryId, { name, imageUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      Alert.alert("Success", "Category updated successfully!");
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      Alert.alert("Error", "Failed to update category.");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      name: data.name,
      imageUrl: data.imageUrl || undefined,
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="text-gray-600 mt-2">Loading category...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-red-600 text-center">
          Failed to load category. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-xl font-bold text-gray-900 mb-2">
        Edit Category
      </Text>
      <Text className="text-sm text-gray-600 mb-4">
        Update the details of your category below.
      </Text>
      <Text className="text-sm font-medium text-gray-700">Category Name</Text>
      <Controller
        control={control}
        name="name"
        rules={{
          required: "Category name is required",
          minLength: { value: 2, message: "Too short" },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Type name"
            value={value}
            onChangeText={onChange}
            className="bg-white p-3 rounded-lg border border-gray-300 mt-2"
          />
        )}
      />
      {errors.name && (
        <Text className="text-sm text-red-600 mt-1">{errors.name.message}</Text>
      )}

      <Text className="text-sm font-medium text-gray-700 mt-4">Image URL</Text>
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
            className="bg-white p-3 rounded-lg border border-gray-300 mt-2"
          />
        )}
      />
      {errors.imageUrl && (
        <Text className="text-sm text-red-600 mt-1">
          {errors.imageUrl.message}
        </Text>
      )}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        className={`flex-row gap-2 justify-center items-center mt-6 p-4 rounded-xl ${
          mutation.isPending ? "bg-gray-400" : "bg-black"
        }`}
        disabled={mutation.isPending}
      >
        <Ionicons name="save" size={18} color="#fff" />
        <Text className="text-white font-medium">
          {mutation.isPending ? "Updating..." : "Update Category"}
        </Text>
      </Pressable>
    </View>
  );
};

export default EditCategoryScreen;
