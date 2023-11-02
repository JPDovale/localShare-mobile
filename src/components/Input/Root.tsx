import { ViewProps } from 'react-native'
import styled from 'styled-components/native'

const Container = styled.View`
  width: 100%;
  background-color: #efefef;
  border-radius: 6px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  height: 40px;
`

type RootProps = ViewProps

export function Root({ ...props }: RootProps) {
  return <Container {...props} />
}
