import { Connection, useConnections } from '@store/connections'
import { Computer, Trash } from 'lucide-react-native'
import { Text, TextProps, TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'
import * as DocumentPicker from 'expo-document-picker'

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
  width: 10px;
  height: 10px;
  border-radius: 99999px;
  background: ${(props) =>
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

interface SelectFileButtonProps extends TouchableOpacityProps {
  disabled?: boolean
}
const SelectFileButton = styled.TouchableOpacity<SelectFileButtonProps>`
  flex: 1;
  background: #242436;
  padding: 4px 10px;
  border-radius: 6px;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
`

const TrashButton = styled.TouchableOpacity<SelectFileButtonProps>`
  background: #242436;
  padding: 4px 10px;
  border-radius: 6px;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
`

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const { uploadsTask, removeConnection } = useConnections((state) => ({
    uploadsTask: state.uploads,
    removeConnection: state.remove,
  }))

  async function handleSendDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
    })

    if (result.canceled) {
      return
    }

    uploadsTask(result, connection.idConnection)
  }

  async function handleConnect() {
    connection.socket.connect()
  }

  async function handleDisconnect() {
    connection.socket.disconnect()
  }

  return (
    <Container>
      <Header>
        <Computer color="#121214" size={20} />
        <Title>{connection.idConnection}</Title>
        <Status status={connection.status} />
      </Header>

      <ButtonsContainer>
        <SelectFileButton
          disabled={connection.status !== 'connected'}
          onPress={handleSendDocument}
        >
          <Text style={{ color: 'white' }}>Enviar</Text>
        </SelectFileButton>

        {connection.status === 'disconnected' && (
          <SelectFileButton onPress={handleConnect}>
            <Text style={{ color: 'white' }}>Conectar</Text>
          </SelectFileButton>
        )}

        {connection.status === 'connected' && (
          <SelectFileButton onPress={handleDisconnect}>
            <Text style={{ color: 'white' }}>Desconectar</Text>
          </SelectFileButton>
        )}

        <TrashButton onPress={() => removeConnection(connection)}>
          <Trash color="white" size={16} />
        </TrashButton>
      </ButtonsContainer>
    </Container>
  )
}
