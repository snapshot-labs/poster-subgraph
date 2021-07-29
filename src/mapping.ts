import { NewPost } from '../generated/Poster/Poster'
import { Post } from '../generated/schema'

export function handleNewPost(event: NewPost): void {
  let id = event.transaction.hash.toHexString()
  let post = new Post(id)
  post.user = event.params.user
  post.content = event.params.content
  post.timestamp = event.block.timestamp.toI32()
  post.save()
}
