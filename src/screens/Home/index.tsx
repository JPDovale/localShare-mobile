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
`

const Label = styled.Text`
  font-family: Roboto_700Bold;
  font-size: 12px;
`

const ConnectionFormSchema = z.object({
  ip: z
    .string({
      required_error: 'Informe um endereço de ip',
    })
    .ip({
      version: 'v4',
      message: 'Endereço ip inválido',
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
    addConnection(data.ip)
    reset()
  }

  return (
    <Container>
      <Label>Para começar digite o ip do dispositivo para se conectar</Label>
      {errors.ip?.message && <Label>{errors.ip.message}</Label>}

      <Input.Root>
        <Input.Icon>
          <Computer color="#9c9c9c" size={18} />
        </Input.Icon>

        <Controller
          control={control}
          name="ip"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input.TextInput
              keyboardType="numeric"
              placeholder="192.168.x.x"
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

      <FlatList
        data={connections}
        renderItem={({ item }) => (
          <ConnectionCard key={item.ip} connection={item} />
        )}
        contentContainerStyle={{
          paddingTop: 18,
          paddingBottom: 40,
        }}
      />
    </Container>
  )
}
