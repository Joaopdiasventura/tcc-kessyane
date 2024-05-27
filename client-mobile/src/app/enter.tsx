import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { EnterInput } from "../components/enterInput";
import { app, useUserContext } from "../contexts";

export function Enter() {
  const navigation = useNavigation();
  const { setUser } = useUserContext();

  const [login, setLogin] = useState<boolean>(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (login) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = async () => {
    try {
      const result = await app
        .post("/user/login", { email, password })
        .then((result) => result.data);
      console.log(result);
      handleToken(result);
    } catch (error: any) {
      Alert.alert("ERRO AO REALIZAR LOGIN", error.response.data.msg);
    }
  };

  const handleRegister = async () => {
    try {
      const result = await app
        .post("/user/register", { name, email, password })
        .then((result) => result.data);
      console.log(result);
      handleToken(result);
    } catch (error: any) {
      Alert.alert("ERRO AO REALIZAR SEU REGISTRO", error.response.data.msg);
    }
  };

  const handleToken = async (token: string) => {
    const result = await app
      .get(`/user/decode/${token}`)
      .then((result) => result.data);
    setUser(result);
    navigation.navigate("Chats");
  };

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <View className=" w-1/2 justify-center items-center">
        <View className="h-full items-center justify-center ">
          <View className="border rounded-md p-2">
            <Text className="text-xl mb-1">
              {login ? "Bem Vindo de Volta" : "Faça seu registro"}
            </Text>
            <View>
              {!login && (
                <>
                  <Text className="text-base">Nome:</Text>
                  <EnterInput
                    onChangeText={setName}
                    placeholder="Digite seu nome de usuário:"
                  />
                </>
              )}
              <>
                <Text className="text-base">Email:</Text>
                <EnterInput
                  onChangeText={setEmail}
                  placeholder="Digite seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </>
              <>
                <Text className="text-base">Senha:</Text>
                <EnterInput
                  onChangeText={setPassword}
                  placeholder="Digite sua senha"
                  secureTextEntry
                />
              </>
              <View className="flex-row gap-2 mt-1">
                <TouchableOpacity
                  className="w-16 h-8 justify-center items-center bg-transparent bg-red-700 rounded"
                  onPress={handleSubmit}
                >
                  <Text className="text-center text-white text-base">
                    ENTRAR
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="h-8 justify-center items-center border rounded p-1"
                  onPress={() => {
                    setLogin(login ? false : true);
                  }}
                >
                  <Text className="text-base">
                    {!login ? "BEM VINDO DE VOLTA" : "FAÇA SEU REGISTRO"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
