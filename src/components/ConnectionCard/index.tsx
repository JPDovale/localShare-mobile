import { Connection } from '@store/connections'
import { Computer } from 'lucide-react-native'
import { Text, TextProps } from 'react-native'
import styled from 'styled-components/native'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'

interface ConnectionCardProps {
  connection: Connection
}

const Container = styled.View.attrs({
  style: {
    elevation: 10,
    shadowColor: '#0000050',
  },
})`
  padding: 10px;
  background: #efefef;
  border-radius: 6px;
`

const Header = styled.View`
  flex-direction: row;
  gap: 6px;
`

const Title = styled.Text`
  font-family: Roboto_700Bold;
`

interface StatusProps extends TextProps {
  status: 'connected' | 'connecting' | 'disconnected'
}

const Status = styled.Text<StatusProps>`
  margin-left: auto;
  font-size: 12px;
  color: ${(props) =>
    props.status === 'connected'
      ? '#22af12'
      : props.status === 'disconnected'
      ? '#ff0000'
      : '#c3c3c3'};
`

const ButtonsContainer = styled.View`
  padding-top: 10px;
  flex-direction: row;
  gap: 6px;
`

const SelectFileButton = styled.TouchableOpacity`
  flex: 1;
  background: #242436;
  padding: 4px 10px;
  border-radius: 6px;
`

export function ConnectionCard({ connection }: ConnectionCardProps) {
  async function handleSendDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
    })

    if (result.canceled) {
      return
    }

    const chunkSize = 1024 * 512
    let tasks = result.assets.length

    result.assets.forEach(async (asset) => {
      const fileData = asset

      const fileBase64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: 'base64',
      })

      let offset = 0
      let chunkPart = 0
      while (offset < fileBase64.length) {
        const nextLoopVerification = offset + chunkSize > fileBase64.length

        const chunk = fileBase64.slice(offset, offset + chunkSize)

        connection.socket.emit('file-chunk', {
          metadata: {
            ...fileData,
            sendingChunk:
              offset + chunkSize > fileBase64.length
                ? fileBase64.length
                : offset + chunkSize,
            base64Size: fileBase64.length,
          },
          tasks,
          content: chunk,
          chunkPart,
          end: !!nextLoopVerification,
        })

        offset += chunkSize
        chunkPart++
      }

      chunkPart = 0
      tasks--
    })
  }

  return (
    <Container>
      <Header>
        <Computer color="#121214" size={20} />
        <Title>{connection.ip}</Title>
        <Status status={connection.status}>{connection.status}</Status>
      </Header>

      <ButtonsContainer>
        <SelectFileButton onPress={handleSendDocument}>
          <Text style={{ color: 'white' }}>Enviar</Text>
        </SelectFileButton>
      </ButtonsContainer>
    </Container>
  )
}
