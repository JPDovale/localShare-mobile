import * as Roboto from '@expo-google-fonts/roboto'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import { Loading } from './src/components/Loading'
import { HomePage } from './src/screens/Home'
import { useConnections } from '@store/connections'

export default function App() {
  useConnections()
  const { Roboto_400Regular, Roboto_700Bold } = Roboto
  const [RobotoLoaded] = Roboto.useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  })

  const loadingFonts = !RobotoLoaded

  return (
    <SafeAreaProvider>
      {loadingFonts ? <Loading /> : <HomePage />}

      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
    </SafeAreaProvider>
  )
}
