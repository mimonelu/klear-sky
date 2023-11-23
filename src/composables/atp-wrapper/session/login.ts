import type { AtpAgentLoginOpts, BskyAgent, ComAtprotoServerCreateSession } from "@atproto/api"
import Util from "@/composables/util"

export default async function (
  this: TIAtpWrapper,
  service?: string,
  identifier?: string,
  password?: string
): Promise<boolean> {
  const session = this.data.sessions[this.data.did]
  service ??= session.__service ?? "https://bsky.social"
  if (!this.createAgent(service)) return false
  if (this.agent == null) return false

  // 自動ログイン
  if (identifier == null || password == null) {
    if (session == null) return false
    await this.resumeSession(session).catch(() => {
      throw { error: "sessionExpired" }
    })

  // 新規ログイン
  } else {
    const optinos: AtpAgentLoginOpts = {
      identifier,
      password,
    }
    try {
      const response: ComAtprotoServerCreateSession.Response =
        await (this.agent as BskyAgent).login(optinos)
      console.log("[klearsky/login]", response)
    } catch (error) {
      console.error("[klearsky/login]", error)
      return false
    }
  }

  // ここで persistSession が入る

  Util.saveStorage("atp", this.data)
  return true
}
