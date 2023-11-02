import { TextInputProps as TextInputNativeProps } from 'react-native'
import styled from 'styled-components/native'

const Container = styled.TextInput`
  flex: 1;
  margin: 0 8px;
  font-family: Roboto_400Regular;
  font-size: 16px;
`

type TextInputProps = TextInputNativeProps

export function TextInput({ ...props }: TextInputProps) {
  return <Container {...props} />
}
