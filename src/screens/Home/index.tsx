import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@components/Input'
import { Computer, Send } from 'lucide-react-native'
import { Controller, useForm } from 'react-hook-form'
import { FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { z } from 'zod'
import { useConnections } from '@store/connections'
import { ConnectionCard } from '@components/ConnectionCard'

const Container = styled(SafeAreaView)`
  padding: 16px 18px;
  flex: 1;
`

const Title = styled.Text`
  font-family: Roboto_700Bold;
  font-size: 32px;
  margin-bottom: 10px;
`

const Label = styled.Text`
  font-family: Roboto_700Bold;
  font-size: 12px;
`

const ConnectionFormSchema = z.object({
  idConnection: z.string({
    required_error: 'Informe um id de conexão',
  }),
})

type ConnectionFormData = z.infer<typeof ConnectionFormSchema>

export function HomePage() {
  const { connections, addConnection } = useConnections((state) => ({
    connections: state.connections,
    addConnection: state.addConnection,
  }))

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(ConnectionFormSchema),
  })

  async function handleConnect(data: ConnectionFormData) {
    addConnection(data.idConnection)
    reset()
  }

  return (
    <Container>
      <Title>Bem vindo(a) ao Smart Sharer</Title>
      <FlatList
        data={connections}
        renderItem={({ item }) => (
          <ConnectionCard key={item.idConnection} connection={item} />
        )}
        contentContainerStyle={{
          paddingBottom: 18,
          gap: 10,
        }}
      />

      <Label>
        Para começar digite o id de conexão do dispositivo para se conectar
      </Label>
      {errors.idConnection?.message && (
        <Label>{errors.idConnection.message}</Label>
      )}

      <Input.Root>
        <Input.Icon>
          <Computer color="#9c9c9c" size={18} />
        </Input.Icon>

        <Controller
          control={control}
          name="idConnection"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input.TextInput
              placeholder="XXXX-XXX-XXX-XXX-X"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <TouchableOpacity onPress={handleSubmit(handleConnect)}>
          <Input.Icon>
            <Send color="#00d100" size={18} />
          </Input.Icon>
        </TouchableOpacity>
      </Input.Root>
    </Container>
  )
}
