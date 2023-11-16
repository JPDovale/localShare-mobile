import { MakeEventsListProps } from './makeEventsList'
import * as FileSystem from 'expo-file-system'
import * as Crypto from 'expo-crypto'

export async function getFilePart({ socket }: MakeEventsListProps) {
  socket.on('get-file-part', async (data, callback) => {
    const file = (await FileSystem.getInfoAsync(data.uri, {
      size: true,
    })) as unknown as {
      size: number
    }

    const offset = data.chunkSize * data.part
    const chunk = await FileSystem.readAsStringAsync(data.uri, {
      encoding: 'base64',
      length: data.chunkSize,
      position: offset,
    })

    const validationHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      chunk,
    )

    // eslint-disable-next-line n/no-callback-literal
    callback({
      chunk,
      fileSize: file.size,
      validationHash,
    })
  })
}
