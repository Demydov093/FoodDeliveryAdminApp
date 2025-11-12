import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "../screens/CategoriesScreen";
import AddCategoryScreen from "../screens/AddCategoryScreen";
import ProductsScreen from "../screens/ProductsScreen";
import AddProductsScreen from "../screens/AddProductsScreen";

const Stack = createNativeStackNavigator();

const CategoriesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "tomato" },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="Category"
        component={CategoriesScreen}
        options={{ title: "Categories" }}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{ title: "Add Category" }}
      />
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={({ route }) => ({
          title: `Products in ${route?.params?.categoryName}`,
        })}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductsScreen}
        options={{ title: "Add Products" }}
      />
    </Stack.Navigator>
  );
};

export default CategoriesStack;
