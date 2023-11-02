import { ActivityIndicator } from 'react-native'
import { LoadingContainer } from './styles'

export function Loading() {
  return (
    <LoadingContainer>
      <ActivityIndicator color="#481BA8" />
    </LoadingContainer>
  )
}
