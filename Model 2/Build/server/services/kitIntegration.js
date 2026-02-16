const KIT_API_BASE = 'https://api.convertkit.com/v3';

/**
 * Add or update a subscriber on a Kit (ConvertKit) form.
 *
 * @param {string} email   - Subscriber email address
 * @param {string} name    - Subscriber first name
 * @param {Object} fields  - Custom field key/value pairs
 */
async function addSubscriber(email, name, fields = {}) {
  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey) return;

  if (!formId) {
    console.warn('[Kit] KIT_FORM_ID not set — skipping subscriber add');
    return;
  }

  try {
    const body = {
      api_key: apiKey,
      email,
      first_name: name,
    };

    if (Object.keys(fields).length > 0) {
      body.fields = fields;
    }

    const res = await fetch(`${KIT_API_BASE}/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[Kit] addSubscriber failed (${res.status}):`, text);
    } else {
      console.log(`[Kit] Subscriber added/updated: ${email}`);
    }
  } catch (err) {
    console.error('[Kit] addSubscriber error:', err.message);
  }
}

/**
 * Tag a subscriber by tag name.
 *
 * Note: The Kit v3 API requires a numeric tag ID, not a tag name.
 * To fully implement this you would first list tags via GET /v3/tags
 * and resolve the name to an ID. For now this logs a placeholder.
 *
 * @param {string} email   - Subscriber email address
 * @param {string} tagName - Human-readable tag name
 */
async function tagSubscriber(email, tagName) {
  const apiKey = process.env.KIT_API_KEY;

  if (!apiKey) return;

  try {
    // TODO: resolve tagName → tagId via GET /v3/tags?api_key=...
    console.log(`[Kit] tagSubscriber placeholder — would tag "${email}" with "${tagName}"`);
  } catch (err) {
    console.error('[Kit] tagSubscriber error:', err.message);
  }
}

module.exports = { addSubscriber, tagSubscriber };
