import { Bytes, ipfs, json } from '@graphprotocol/graph-ts'
import { NewPost } from '../generated/Poster/Poster'
import { Post, Action } from '../generated/schema'

export function handleNewPost(event: NewPost): void {
  let id = event.transaction.hash.toHexString()
  let user = event.params.user
  let content = event.params.content
  let timestamp = event.block.timestamp.toI32()

  let post = new Post(id)
  post.user = user
  post.content = content
  post.timestamp = timestamp
  post.save()

  if (content.startsWith('ipfs://')) {
    let hash = content.slice(7)
    let data = ipfs.cat(hash)

    if (data !== null) {
      let value = json.try_fromBytes(data as Bytes)
      let obj = value.value.toObject()
      let type = obj.get('type').toString()
      let target = obj.get('target').toString()

      let action = new Action(id)
      action.user = user
      action.type = type
      action.target = target
      action.timestamp = timestamp
      action.save()
    }
  }
}
