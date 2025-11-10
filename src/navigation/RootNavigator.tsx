import React from "react";
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import CategoriesStack from "./CategoriesStack";
import UserScreen from "../screens/UserScreen";
import OrdersStack from "./OrdersStack";

import { Ionicons } from "@expo/vector-icons";

type RootTabParamList = {
  CategoriesTab: undefined;
  Users: undefined;
  OrdersTab: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: { name: keyof RootTabParamList };
      }): BottomTabNavigationOptions => ({
        tabBarIcon: ({
          focused,
          color,
          size,
        }: {
          focused: boolean;
          color: string;
          size: number;
        }) => {
          let iconName = "home";

          if (route.name === "CategoriesTab") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Users") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "OrdersTab") {
            iconName = focused ? "cart" : "cart-outline";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesStack}
        options={{ title: "Categories" }}
      />
      <Tab.Screen
        name="Users"
        component={UserScreen}
        options={{ title: "Users" }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{ title: "Orders" }}
      />
    </Tab.Navigator>
  );
};

export default RootNavigator;
