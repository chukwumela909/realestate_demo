/* eslint-disable @typescript-eslint/no-require-imports */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const ts = require("typescript");

require.extensions[".ts"] = function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;

  module._compile(output, filename);
};

const { sendWelcomeEmail } = require("./email.ts");

function withEnv(env, fn) {
  const previous = new Map();
  for (const key of Object.keys(env)) {
    previous.set(key, process.env[key]);
    if (env[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = env[key];
    }
  }

  try {
    return fn();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    globalThis.resend = undefined;
  }
}

function makeClient(send) {
  return { emails: { send } };
}

test("sendWelcomeEmail fails when RESEND_API_KEY is missing", async () => {
  await withEnv(
    {
      RESEND_API_KEY: undefined,
      CLOUD9_FROM_EMAIL: "Cloud9 <sales@example.com>",
      MAISON_FROM_EMAIL: undefined,
    },
    async () => {
      const result = await sendWelcomeEmail({
        to: "buyer@example.com",
        properties: [],
      });

      assert.deepEqual(result, {
        ok: false,
        error: "Missing RESEND_API_KEY",
      });
    },
  );
});

test("sendWelcomeEmail refuses the Resend test sender by default", async () => {
  let called = false;

  await withEnv(
    {
      RESEND_API_KEY: "re_test",
      CLOUD9_FROM_EMAIL: undefined,
      MAISON_FROM_EMAIL: undefined,
    },
    async () => {
      const result = await sendWelcomeEmail(
        { to: "buyer@example.com", properties: [] },
        makeClient(async () => {
          called = true;
          return { data: { id: "email_123" } };
        }),
      );

      assert.equal(called, false);
      assert.deepEqual(result, {
        ok: false,
        error:
          "Missing CLOUD9_FROM_EMAIL. Configure a verified Resend sender before sending to customers.",
      });
    },
  );
});

test("sendWelcomeEmail sends with a verified sender", async () => {
  let payload = null;

  await withEnv(
    {
      RESEND_API_KEY: "re_test",
      CLOUD9_FROM_EMAIL: "Cloud9 <sales@example.com>",
      MAISON_FROM_EMAIL: undefined,
    },
    async () => {
      const result = await sendWelcomeEmail(
        { to: "buyer@example.com", name: "Ada", properties: [] },
        makeClient(async (nextPayload) => {
          payload = nextPayload;
          return { data: { id: "email_123" } };
        }),
      );

      assert.deepEqual(result, { ok: true, id: "email_123" });
      assert.equal(payload.from, "Cloud9 <sales@example.com>");
      assert.equal(payload.to, "buyer@example.com");
      assert.match(payload.html, /Dear Ada/);
      assert.match(payload.text, /Dear Ada/);
    },
  );
});

test("sendWelcomeEmail can opt into the Resend test sender", async () => {
  let payload = null;

  await withEnv(
    {
      RESEND_API_KEY: "re_test",
      CLOUD9_FROM_EMAIL: undefined,
      MAISON_FROM_EMAIL: undefined,
    },
    async () => {
      const result = await sendWelcomeEmail(
        {
          to: "account@example.com",
          properties: [],
          allowTestSender: true,
        },
        makeClient(async (nextPayload) => {
          payload = nextPayload;
          return { data: { id: "email_456" } };
        }),
      );

      assert.deepEqual(result, { ok: true, id: "email_456" });
      assert.equal(
        payload.from,
        "Cloud9 Properties Limited <onboarding@resend.dev>",
      );
    },
  );
});

test("sendWelcomeEmail returns provider errors", async () => {
  await withEnv(
    {
      RESEND_API_KEY: "re_test",
      CLOUD9_FROM_EMAIL: "Cloud9 <sales@example.com>",
      MAISON_FROM_EMAIL: undefined,
    },
    async () => {
      const result = await sendWelcomeEmail(
        { to: "buyer@example.com", properties: [] },
        makeClient(async () => ({ error: { message: "domain not verified" } })),
      );

      assert.deepEqual(result, {
        ok: false,
        error: "domain not verified",
      });
    },
  );
});

test("sendWelcomeEmail returns thrown client errors", async () => {
  await withEnv(
    {
      RESEND_API_KEY: "re_test",
      CLOUD9_FROM_EMAIL: "Cloud9 <sales@example.com>",
      MAISON_FROM_EMAIL: undefined,
    },
    async () => {
      const result = await sendWelcomeEmail(
        { to: "buyer@example.com", properties: [] },
        makeClient(async () => {
          throw new Error("network down");
        }),
      );

      assert.deepEqual(result, { ok: false, error: "network down" });
    },
  );
});
