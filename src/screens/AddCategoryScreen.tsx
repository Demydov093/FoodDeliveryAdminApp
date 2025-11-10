import { View, Text, TextInput, Pressable } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

const AddCategoryScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; imageUrl?: string }>({
    defaultValues: { name: "", imageUrl: "" },
  });

  return (
    <View className="flex-1 bg-gray-20 p-4">
      <Text className="text-lg font-bold text-gray-900 mb-2">
        Add New Category
      </Text>
      <Text className="text-small text-gray-600 mb-4">Give it a name</Text>
      <Text className="text-sm font-medium text-gray-700">Category name</Text>
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
            onChange={onChange}
            className="bg-white p-3 rounded-lg border border-gray-300 mt-2 py-2"
          />
        )}
      />
      {errors?.name && (
        <Text className="text-sm text-red-700">{errors.name.message}</Text>
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
            onChange={onChange}
            className="bg-white p-3 rounded-lg border border-gray-300 mt-2 py-2"
          />
        )}
      />
      {errors?.imageUrl && (
        <Text className="text-sm text-red-700">{errors.imageUrl.message}</Text>
      )}

      <Pressable
        onPress={handleSubmit}
        className="bg-black flex-row gap-3 justify-center items-center mt-6 p-4 rounded-xl"
      >
        <Ionicons name="save" size={18} color="#fff" />
        <Text className="text-white">Create category</Text>
      </Pressable>
    </View>
  );
};

export default AddCategoryScreen;
