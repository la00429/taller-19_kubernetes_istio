import os
import asyncio
import requests

# variables de entorno
EUREKA_ENABLED = os.getenv("EUREKA_ENABLED", "1").lower() not in ("0", "false", "no")
EUREKA_SERVER = os.getenv("EUREKA_SERVER", "http://localhost:8761/eureka").rstrip("/")
APP_NAME = os.getenv("APP_NAME", "order-microservice")
FORCED_HOST = (os.getenv("EUREKA_HOSTNAME", "localhost").strip() or "localhost")
PORT = int(os.getenv("PORT", "8082"))
HEARTBEAT_INTERVAL = int(os.getenv("EUREKA_HEARTBEAT_INTERVAL", "10"))


INSTANCE_ID = f"{FORCED_HOST}:{APP_NAME}:{PORT}"

_registered = False
_heartbeat_task: asyncio.Task | None = None


def _build_instance_xml() -> str:
    return f"""<instance>
  <instanceId>{INSTANCE_ID}</instanceId>
  <hostName>{FORCED_HOST}</hostName>
  <app>{APP_NAME}</app>
  <ipAddr>127.0.0.1</ipAddr>
  <status>UP</status>
  <port enabled="true">{PORT}</port>
  <healthCheckUrl>http://localhost:{PORT}/health</healthCheckUrl>
  <dataCenterInfo class="com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo">
    <name>MyOwn</name>
  </dataCenterInfo>
</instance>"""


def _register() -> bool:
    if not EUREKA_ENABLED:
        return False
    url = f"{EUREKA_SERVER}/apps/{APP_NAME}"
    try:
        r = requests.post(
            url,
            data=_build_instance_xml(),
            headers={"Content-Type": "application/xml"},
            timeout=5,
        )
        if r.status_code in (200, 204):
            print(f"[EUREKA] Registrado {APP_NAME} como {INSTANCE_ID}")
            return True
        print(f"[EUREKA] Registro falló status={r.status_code} body={r.text[:120]}")
    except Exception as e:
        print(f"[EUREKA] Error registrando: {e}")
    return False


def _heartbeat() -> bool:
    if not EUREKA_ENABLED or not _registered:
        return False
    url = f"{EUREKA_SERVER}/apps/{APP_NAME}/{INSTANCE_ID}"
    try:
        r = requests.put(url, timeout=5)
        if r.status_code in (200, 204):
            return True
        # Si Eureka devuelve 404 (p.ej., tras reiniciarse), intentamos re-registrar
        if r.status_code == 404:
            print("[EUREKA] Heartbeat 404 → re-registering")
            ok = _register()
            return ok
        print(f"[EUREKA] Heartbeat fallo status={r.status_code}")
        return False
    except Exception as e:
        print(f"[EUREKA] Error heartbeat: {e}")
        return False


def _deregister():
    if not EUREKA_ENABLED or not _registered:
        return
    url = f"{EUREKA_SERVER}/apps/{APP_NAME}/{INSTANCE_ID}"
    try:
        requests.delete(url, timeout=5)
        print("[EUREKA] Deregistro enviado")
    except Exception as e:
        print(f"[EUREKA] Error deregistro: {e}")


async def start_eureka_registration():
    global _registered, _heartbeat_task
    if not EUREKA_ENABLED:
        print("[EUREKA] Deshabilitado (EUREKA_ENABLED=0)")
        return
    loop = asyncio.get_event_loop()
    for attempt in range(4):
        ok = await loop.run_in_executor(None, _register)
        if ok:
            _registered = True
            break
        await asyncio.sleep(2 ** attempt)
    if not _registered:
        print("[EUREKA] No se logró registrar (seguirá intentando con heartbeats)")
    async def hb_loop():
        print(f"[EUREKA] Heartbeat cada {HEARTBEAT_INTERVAL}s para {INSTANCE_ID}")
        while True:
            _heartbeat()
            await asyncio.sleep(HEARTBEAT_INTERVAL)
    _heartbeat_task = asyncio.create_task(hb_loop())


async def stop_eureka_registration():
    global _heartbeat_task
    if _heartbeat_task:
        _heartbeat_task.cancel()
        try:
            await _heartbeat_task
        except Exception:
            pass
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _deregister)