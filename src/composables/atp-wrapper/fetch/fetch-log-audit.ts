import Util from "@/composables/util"

export default async function (
  this: TIAtpWrapper,
  did: string
): Promise<undefined | any> {
  const url = did.startsWith("did:plc:")
    // did:plc:
    ? `https://plc.directory/${did}/log/audit`

    // did:plc: 以外
    : `https://dev.uniresolver.io/1.0/identifiers/${did}`

  let logJson: undefined | any = Util.cache.get("logAudit", url)
  if (logJson != null) return logJson
  const log = await fetch(url)
  logJson = await log.json()
  console.log("[klearsky/log/audit]", logJson)

  // TODO: 配列型以外では Sandbox　で不具合が生じる可能性あり。要検証
  if (Array.isArray(logJson)) {
    logJson.reverse()
  }

  Util.cache.set("logAudit", url, logJson)
  return logJson
}
