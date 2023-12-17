import type { BskyAgent, ComAtprotoRepoPutRecord } from "@atproto/api"
import Util from "@/composables/util"

export default async function (
  this: TIAtpWrapper,
  list: TTList
): Promise<undefined | Error> {
  if (this.agent == null) return Error("No Agent")
  const rkey = Util.getRkey(list.uri)
  const query: ComAtprotoRepoPutRecord.InputSchema = {
    repo: this.session?.did as string,
    collection: "app.bsky.graph.list",
    rkey,
    record: {
      $type: "app.bsky.graph.list",
      createdAt: list.indexedAt,
      description: list.description,
      name: list.name,
      purpose: list.purpose,
    },
  }
  const response: ComAtprotoRepoPutRecord.Response =
    await (this.agent as BskyAgent).com.atproto.repo.putRecord(query)
      .then((value: ComAtprotoRepoPutRecord.Response) => value)
      .catch((error: any) => error)
  console.log("[klearsky/putRecord]", response)
  if (!response.success) return Error("Failed")
}
