import { View, Text, ScrollView, Image, StatusBar } from "react-native";
import React from "react";
import { Link, Redirect, router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";

const Home = () => {
  const { isLoggedIn, isLoading } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href={"/home"} />;

  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className={"w-full justify-center items-center h-full px-4 "}>
          <Image
            source={images.logo}
            className="w-[130px] h-[84px] "
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/login")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Home;
