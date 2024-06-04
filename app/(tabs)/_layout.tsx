import { Tabs } from "expo-router";
import React from "react";
import { icons } from "@/constants";
import { Image, ImageSourcePropType, Text, View } from "react-native";

type TabIconType = {
  icon: ImageSourcePropType | undefined;
  color: string;
  name: string;
  focused: boolean;
};

const tabs = [
  { name: "home", icon: icons.home },
  // { name: "bookmark", icon: icons.bookmark },
  { name: "create", icon: icons.plus },
  { name: "profile", icon: icons.profile },
];

const TabIcon = ({ icon, color, name, focused }: TabIconType) => {
  return (
    <View className="gap-2 py-3 items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-5 h-5"
      />
      <Text
        className={`${
          focused ? "font-psemibold" : "font-pregular"
        } text-xs capitalize`}
        style={{ color }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffa001",
        tabBarInactiveTintColor: "#cdcde0",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 84,
        },
      }}
    >
      {tabs.map((tab, idx) => (
        <Tabs.Screen
          name={tab.name}
          key={idx}
          options={{
            title: tab.name,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name={tab.name}
                color={color}
                focused={focused}
                icon={tab.icon}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
