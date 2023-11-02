import { ViewProps } from 'react-native'
import styled from 'styled-components/native'

const Container = styled.View`
  padding: 8px;
`

export function Icon({ ...props }: ViewProps) {
  return <Container {...props} />
}
