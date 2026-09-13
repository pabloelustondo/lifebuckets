"""Explicit, commit-gated LifeBuckets release steps. Never invoke cloud mutations on import."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
PROJECT = "lifebuckets-bd43d"
NUMBER = "118747582700"
REGION = "northamerica-northeast1"
SERVICE = "lifebuckets-chat"
REPOSITORY = "lifebuckets-chat"
SECRET = "lifebuckets-chat-openai"
IDENTITY = f"{SERVICE}@{PROJECT}.iam.gserviceaccount.com"
HOST = f"https://{PROJECT}.web.app"
STATE = ROOT / ".env.chatkit-release.json"


def run(args, *, secret_input=None, structured=False):
    result = subprocess.run(args, cwd=ROOT, input=secret_input, text=True, capture_output=True)
    if result.returncode:
        # Secret-bearing operations must never echo provider values or command output.
        if secret_input is None:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError(f"{args[0]} operation failed (exit {result.returncode})")
    return json.loads(result.stdout) if structured else result.stdout.strip()


def cloud(*args, structured=False, secret_input=None):
    command = ["gcloud", *args, f"--project={PROJECT}", "--quiet"]
    if structured:
        command.append("--format=json")
    return run(command, structured=structured, secret_input=secret_input)


def request_json(url, body=None):
    token = run(["gcloud", "auth", "print-access-token"])
    request = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json", "x-goog-user-project": PROJECT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def preflight(owner_email):
    project = cloud("projects", "describe", PROJECT, structured=True)
    if str(project.get("projectNumber")) != NUMBER or project.get("lifecycleState") != "ACTIVE":
        raise RuntimeError("Unexpected project identity or state")
    billing = cloud("billing", "projects", "describe", PROJECT, structured=True)
    result = request_json(f"https://identitytoolkit.googleapis.com/v1/projects/{PROJECT}/accounts:lookup",
                          {"email": [owner_email]})
    users = result.get("users", [])
    if len(users) != 1 or users[0].get("disabled") or users[0].get("email", "").lower() != owner_email.lower():
        raise RuntimeError("Expected exactly one existing enabled owner; no accounts were changed")
    print("Verified production project and existing enabled owner (read-only).")
    if not billing.get("billingEnabled"):
        raise RuntimeError("Billing must be enabled by the project owner")
    print("Billing is enabled.")
    return users[0]["localId"]


def committed_candidate(expected):
    head = run(["git", "rev-parse", "HEAD"])
    if not expected or head != expected:
        raise RuntimeError("Supply --commit with the exact reviewed full commit SHA")
    if run(["git", "status", "--porcelain"]):
        raise RuntimeError("Commit the reviewed release changes before cloud mutation")
    if run(["git", "branch", "--show-current"]) != "codex/sprint-004-chatkit-poc":
        raise RuntimeError("Use the approved Sprint 004 branch")
    return head


def save(state):
    # Contains release IDs and owner UID, never the API key; ignored by Git.
    if STATE.is_symlink():
        raise RuntimeError("Refusing a symlink for release state")
    with os.fdopen(os.open(STATE, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), "w") as handle:
        json.dump(state, handle, indent=2)


def provision(state):
    cloud("services", "enable", "run.googleapis.com", "cloudbuild.googleapis.com",
          "artifactregistry.googleapis.com", "secretmanager.googleapis.com")
    repositories = cloud("artifacts", "repositories", "list", f"--location={REGION}", structured=True)
    if not any(r["name"].endswith("/" + REPOSITORY) for r in repositories):
        cloud("artifacts", "repositories", "create", REPOSITORY, "--repository-format=docker", f"--location={REGION}")
    accounts = cloud("iam", "service-accounts", "list", structured=True)
    if not any(a["email"] == IDENTITY for a in accounts):
        cloud("iam", "service-accounts", "create", SERVICE, "--display-name=LifeBuckets chat runtime")
    secrets = cloud("secrets", "list", structured=True)
    if not any(s["name"].endswith("/" + SECRET) for s in secrets):
        cloud("secrets", "create", SECRET, "--replication-policy=user-managed", f"--locations={REGION}")
    if not state.get("secretVersion"):
        from dotenv import dotenv_values
        key = dotenv_values(ROOT / ".env.local").get("OPENAI_API_KEY")
        if not key:
            raise RuntimeError("The authorized local server key is absent")
        version = cloud("secrets", "versions", "add", SECRET, "--data-file=-", structured=True, secret_input=key)
        state["secretVersion"] = version["name"].rsplit("/", 1)[-1]
        save(state)
    cloud("secrets", "add-iam-policy-binding", SECRET,
          f"--member=serviceAccount:{IDENTITY}", "--role=roles/secretmanager.secretAccessor")
    state["provisioned"] = True
    save(state)
    print("Declared cloud resources and secret binding prepared.")


def backend(state):
    if not state.get("provisioned") or not state.get("secretVersion"):
        raise RuntimeError("Run provision first")
    tag = f"{REGION}-docker.pkg.dev/{PROJECT}/{REPOSITORY}/server:{state['commit']}"
    config = {"steps": [{"name": "gcr.io/cloud-builders/docker", "args": ["build", "-f", "server/Dockerfile", "-t", tag, "."]}], "images": [tag]}
    with tempfile.TemporaryDirectory(prefix="lifebuckets-build-") as folder:
        path = Path(folder) / "cloudbuild.json"
        path.write_text(json.dumps(config))
        build = cloud("builds", "submit", ".", f"--config={path}", f"--region={REGION}", "--suppress-logs", structured=True)
    if build.get("status") != "SUCCESS":
        raise RuntimeError("Container build did not succeed")
    digest = build["results"]["images"][0]["digest"]
    image = tag.rsplit(":", 1)[0] + "@" + digest
    state["buildId"], state["image"] = build["id"], image
    services = cloud("run", "services", "list", f"--region={REGION}", structured=True)
    previous = next((s for s in services if s.get("metadata", {}).get("name") == SERVICE), None)
    if "previousTraffic" not in state:
        state["previousTraffic"] = previous.get("status", {}).get("traffic", []) if previous else []
    save(state)
    env = {"CHATKIT_ENV": "production", "CHATKIT_FIREBASE_PROJECT": PROJECT, "CHATKIT_PROVIDER": "openai",
           "CHATKIT_MODEL": "gpt-4.1-mini", "CHATKIT_OWNER_UID": state["ownerUid"]}
    cloud("run", "deploy", SERVICE, f"--image={image}", f"--region={REGION}",
          f"--service-account={IDENTITY}", "--allow-unauthenticated", "--ingress=all",
          "--min=0", "--max=1", "--min-instances=0", "--max-instances=1", "--concurrency=8",
          "--cpu=1", "--memory=512Mi", "--timeout=60", "--port=8080",
          "--set-env-vars=" + ",".join(f"{k}={v}" for k, v in env.items()),
          f"--set-secrets=OPENAI_API_KEY={SECRET}:{state['secretVersion']}")
    service = cloud("run", "services", "describe", SERVICE, f"--region={REGION}", structured=True)
    state["revision"] = service["status"]["latestReadyRevisionName"]
    state["url"] = service["status"]["url"]
    save(state)
    verify_endpoint(state["url"])
    print("Backend ready; anonymous chat rejected. Hosting has not been published.")


def verify_endpoint(base):
    import urllib.error
    with urllib.request.urlopen(base + "/api/chatkit/health", timeout=60) as response:
        if json.load(response) != {"provider": "openai", "history": "temporary"}:
            raise RuntimeError("Unexpected backend health")
    request = urllib.request.Request(base + "/api/chatkit", data=b"{}", headers={"Content-Type": "application/json"})
    try:
        urllib.request.urlopen(request, timeout=60)
    except urllib.error.HTTPError as error:
        if error.code == 401:
            return
        raise RuntimeError("Unexpected anonymous response") from None
    raise RuntimeError("Anonymous chat was not rejected")


def hosting(state):
    if not state.get("url") or not state.get("revision"):
        raise RuntimeError("Deploy and verify backend first")
    verify_endpoint(state["url"])
    if not run(["node", "--version"]).startswith("v24."):
        raise RuntimeError("Use supported Node 24 for the hosted build")
    # Build rejects missing production domain registration. No placeholder is written.
    run(["npm", "run", "build:production"])
    releases_url = f"https://firebasehosting.googleapis.com/v1beta1/sites/{PROJECT}/releases?pageSize=1"
    before = request_json(releases_url).get("releases", [])
    state["previousHostingRelease"] = before[0] if before else None
    save(state)
    run(["node", "node_modules/firebase-tools/lib/bin/firebase.js", "deploy", "--only", "hosting", "--project", PROJECT, "--non-interactive"])
    state["hostingRelease"] = request_json(releases_url).get("releases", [])
    save(state)
    verify_endpoint(HOST)
    print("Hosting published; authenticated desktop/phone acceptance is still required.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("step", choices=["preflight", "provision", "backend", "hosting"])
    parser.add_argument("--owner-email", required=True, help="Existing approved personal account")
    parser.add_argument("--commit", help="Full reviewed release commit SHA")
    parser.add_argument("--execute", action="store_true", help="Permit this explicit cloud mutation step")
    args = parser.parse_args()
    os.chdir(ROOT)
    if args.step == "preflight":
        preflight(args.owner_email)
        return
    if not args.execute:
        parser.error("Cloud mutation requires --execute and the reviewed --commit")
    commit = committed_candidate(args.commit)
    owner = preflight(args.owner_email)
    state = json.loads(STATE.read_text()) if STATE.exists() else {}
    if state and (state.get("project") != PROJECT or state.get("commit") != commit or state.get("ownerUid") != owner):
        raise RuntimeError("Existing release state belongs to a different candidate or owner; review it before proceeding")
    state.update(project=PROJECT, commit=commit, ownerUid=owner)
    save(state)
    {"provision": provision, "backend": backend, "hosting": hosting}[args.step](state)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        # Never expose HTTP response bodies or credential values.
        reason = str(error) if type(error) is RuntimeError else type(error).__name__
        print(f"Deployment stopped: {reason}. Review the failed step before retrying.", file=sys.stderr)
        sys.exit(1)
