import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "../screens/CategoriesScreen";

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
        name="Categories"
        component={CategoriesScreen}
        options={{ title: "Categories" }}
      />
    </Stack.Navigator>
  );
};

export default CategoriesStack;
