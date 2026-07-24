import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const sourceDir = path.dirname(fileURLToPath(import.meta.url));

test("FnDepot v2 and legacy indexes describe the same public release", async () => {
  const current = JSON.parse(
    await readFile(path.join(sourceDir, "fndepot.json"), "utf8"),
  );
  const legacy = JSON.parse(
    await readFile(path.join(sourceDir, "fnpack.json"), "utf8"),
  );

  assert.equal(current.schema_version, "2.0");
  assert.ok(current.source_info);

  const app = current.apps.savextube;
  assert.equal(app.display_name, "SaveXTube");
  assert.deepEqual(app.platform, ["x86"]);
  assert.equal(app.icon_url, "./savextube/ICON.PNG");
  assert.equal(app.run_as, "package");
  assert.equal(app.is_docker, false);

  const versions = Object.keys(app.releases);
  assert.equal(versions.length, 1);
  const version = versions[0];
  const pkg = app.releases[version].packages.x86;

  assert.match(pkg.download_url, /^https:\/\/download\.savextube\.com\/.+\.fpk$/);
  assert.match(pkg.sha256, /^[a-f0-9]{64}$/);
  assert.ok(Number.isInteger(pkg.size) && pkg.size > 0);

  assert.equal(legacy.savextube.version, version);
  assert.equal(legacy.savextube.download_url, pkg.download_url);
  assert.deepEqual(legacy.savextube.platform, ["x86"]);
  assert.equal(legacy.savextube.isdocker, "false");

  await access(path.join(sourceDir, "savextube", "ICON.PNG"));
  await access(path.join(sourceDir, "savextube", "README.md"));
});
