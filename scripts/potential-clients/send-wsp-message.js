const path = require("node:path");

try {
    require.resolve("whatsapp-web.js");
    require.resolve("qrcode-terminal");
} catch (_e) {
    console.log("Installing necessary dependencies...");
    const {execSync} = require("node:child_process");
    execSync("pnpm install -D whatsapp-web.js qrcode-terminal", {
        stdio: "inherit",
    });
}

const {Client, LocalAuth, MessageMedia} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const imagePath = path.join(__dirname, "./vigiia_potential-clients.png");

const message = require("./message").message;

const data = require("./potential_clients.json");

const DELAY_MS = Number(process.env.WSP_DELAY_MS || 1500);
const SESSION_NAME = process.env.WSP_SESSION_NAME || "saludables-wsp";
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toE164 = (rawPhone) => {
    const digits = String(rawPhone).replace(/\D/g, "");
    if (!digits) return null;

    if (digits.startsWith("51")) return `+${digits}`;
    if (digits.length === 9) return `+51${digits}`;
    return `+${digits}`;
};

const toChatId = (rawPhone) => {
    const e164 = toE164(rawPhone);
    if (!e164) return null;
    return `${e164.replace("+", "")}@c.us`;
};

const createClient = () => {
    const client = new Client({
        authStrategy: new LocalAuth({clientId: SESSION_NAME}),
        puppeteer: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
    });

    client.on("qr", (qr) => {
        console.log("Scan this QR from WhatsApp > Linked devices");
        qrcode.generate(qr, {small: true});
    });

    client.on("authenticated", () => {
        console.log("WhatsApp authenticated");
    });

    client.on("auth_failure", (msg) => {
        console.error("Auth failure:", msg);
    });

    client.on("disconnected", (reason) => {
        console.warn("WhatsApp disconnected:", reason);
    });

    return client;
};

const run = async () => {
    console.log("Mode: SEND");
    console.log(`Contacts: ${data.length}`);

    if (LIMIT !== null && (!Number.isFinite(LIMIT) || LIMIT <= 0)) {
        throw new Error("Invalid --limit value. Example: --limit=1");
    }

    const client = createClient();

    await new Promise((resolve, reject) => {
        client.once("ready", () => {
            console.log("WhatsApp client is ready");
            resolve();
        });
        client.once("auth_failure", (err) => reject(new Error(err)));
        client.initialize().catch(reject);
    });

    let ok = 0;
    let failed = 0;

    const contacts = LIMIT ? data.slice(0, LIMIT) : data;
    if (LIMIT) {
        console.log(`Processing first ${contacts.length} contact(s) only`);
    }

    for (const item of contacts) {
        const rawPhones = Array.isArray(item.phones)
            ? item.phones
            : item.phone
              ? [item.phone]
              : [];

        if (rawPhones.length === 0) {
            failed += 1;
            console.error(`[FAIL] ${item.name}: no phone numbers found`);
            continue;
        }

        const text = message(item);

        for (const rawPhone of rawPhones) {
            const chatId = toChatId(rawPhone);
            if (!chatId) {
                failed += 1;
                console.error(
                    `[FAIL] ${item.name}: invalid phone (${rawPhone})`
                );
                continue;
            }

            try {
                const media = MessageMedia.fromFilePath(imagePath);
                await client.sendMessage(chatId, media, {caption: text});
                ok += 1;
                console.log(`[OK] ${item.name} -> ${chatId}`);
            } catch (error) {
                failed += 1;
                console.error(
                    `[FAIL] ${item.name} -> ${chatId}: ${error.message}`
                );
            }

            await sleep(DELAY_MS);
        }
    }

    console.log(`Done. Sent: ${ok}, Failed: ${failed}`);
    await client.destroy();
};

run().catch((error) => {
    console.error("Fatal error:", error.message);
    process.exit(1);
});
