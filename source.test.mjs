import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const sourceDir = path.dirname(fileURLToPath(import.meta.url));

test("FnDepot current and legacy index filenames describe the same release", async () => {
  const current = JSON.parse(
    await readFile(path.join(sourceDir, "fndepot.json"), "utf8"),
  );
  const legacy = JSON.parse(
    await readFile(path.join(sourceDir, "fnpack.json"), "utf8"),
  );

  assert.deepEqual(current, legacy);

  const app = current.savextube;
  assert.equal(app.display_name, "SaveXTube");
  assert.deepEqual(app.platform, ["x86"]);
  assert.match(app.version, /^\d+(?:\.\d+)+$/);
  assert.match(
    app.download_url,
    /^https:\/\/download\.savextube\.com\/.+\.fpk$/,
  );
  assert.equal(app.install_type, "存储空间");
  assert.equal(app.isdocker, "false");
  assert.ok(Number.parseFloat(app.size) > 0);

  await access(path.join(sourceDir, "savextube", "ICON.PNG"));
  await access(path.join(sourceDir, "savextube", "README.md"));
});
