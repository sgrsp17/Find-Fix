import { Pressable, Text, View } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center gap-6 bg-night px-6">
      <Text className="text-4xl font-bold text-mist">
        Find<Text className="text-amber">&amp;</Text>Fix
      </Text>
      <Text className="text-center text-base text-mist/70">
        Reparações e remodelações mais simples, transparentes e rápidas.
      </Text>
      <View className="w-full max-w-sm gap-3">
        <Pressable className="items-center rounded-xl bg-amber py-3 active:opacity-80">
          <Text className="font-semibold text-night">Registar</Text>
        </Pressable>
        <Pressable className="items-center rounded-xl border border-mist/30 py-3 active:opacity-80">
          <Text className="font-semibold text-mist">Entrar</Text>
        </Pressable>
      </View>
    </View>
  );
}
