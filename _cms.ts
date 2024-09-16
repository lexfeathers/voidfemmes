import lumeCMS from "lume/cms/mod.ts";
import GitHub from "lume/cms/storage/github.ts";
import { Octokit } from "npm:octokit";
import _fields from "lume/cms/fields/core.ts";

const username = Deno.env.get("USERNAME");
const password = Deno.env.get("PASSWORD");

// 1. Create the cms instance
const cms = lumeCMS({
  site: {
    name: "Void Femmes",
    url: "https://voidfemmes.ca",
  }, 
  auth: {
    method: "basic",
    users: {
      [username]: password,
    },
  },
  extraHead: `
  <style>
    [data-theme="dark"] {
      --color-black: hsl(220, 0%, 15%);
      --color-text: hsl(220, 0%, 90%);
      --color-dim: hsl(220, 0%, 60%);
      --color-line: hsl(220, 0%, 20%);
      --color-line-light: hsl(220, 0%, 15%);
      --color-highlight: hsl(220, 0%, 18%);
      --color-background: hsl(220, 0%, 10%);
      --color-input-text: var(--color-white);
      --color-input-bg: var(--color-black);

      /* Brand colors */
      --color-primary: hsl(0, 50%, 45%);
      --color-primary-highlight: hsl(0, 50%, 35%);

      /* Code colors */
      --color-code-4: hsl(220, 20%, 50%);
      --color-code-5: hsl(0, 88%, 65%);
      --color-code-a: hsl(290, 100%, 40%);
      --color-code-b: hsl(290, 90%, 70%);
      --color-code-c: #2913c0;
      --color-code-d: hsl(155, 75%, 50%);
      --color-code-e: #bf4040;
      --color-code-f: hsl(17, 100%, 63%);
      --color-code-g: #00f;
      --color-code-h: hsl(220, 100%, 65%);
      --color-code-i: #0e8759;
      --color-code-j: #167;
      --color-code-k: #256;
      --color-code-l: #00c;
      --color-code-m: #940;
      --color-code-n: hsl(220, 20%, 80%);
    }
    .header-description {
      margin: 1rem 0;
    }
    .header-description a {
      background-color: var(--color-highlight);
      padding: 8px;
      border-radius: 4px;
      font-weight: bold;
    }
  </style>
    `,
});

// 2. Create file system
// cms.storage("my_fs", "/");

cms.storage(
  "my_fs",
  new GitHub({
    client: new Octokit({ auth: Deno.env.get("GITHUB_TOKEN") }),
    owner: "lexfeathers",
    repo: "voidfemmes",
  }),
);

// 3. Create a document to edit the homepage (index.md file)
cms.document(
  "Landing page", 
  "my_fs:index.njk", 
  [
    "content: markdown",
  ]
);
cms.document(
  "stylesheet: Edit the CSS for the site", 
  "my_fs:assets/styles.css", 
  [
    "content: markdown",
  ]
);
cms.document(
  "site-name: Edit the site name", 
  "my_fs:/_includes/templates/name.njk", 
  [
    "content: text",
  ]
);

// 4. Create "posts" and "pages" collections
// using my_fs storage
cms.collection({
  name: "posts",
  store: "my_fs:posts/*.md",
  fields: [
    "title: text",
    {
      name: "author",
      type: "text",
      options: [
        "Lex Feathers",
      ],
    },
    {
      name: "draft",
      type: "checkbox",
    },
    {
      name: "published",
      type: "datetime",
      mode: "create"
    },
    {
      name: "image",
      type: "file",
      uploads: "uploads",
    },
    {
      name: "image_caption",
      type: "text",
      label: "Image caption",
    },
    "content: markdown",
    "tags: list",
    {
      name: "excerpt",
      type: "textarea",
      description: "Used on the front page",
      attributes: {
        maxlength: 800
      }
    },
  ],
  nameField: "title",
});
cms.collection("pages", "my_fs:pages/*.md", [
  "title: text",
  "content: markdown",
]);
cms.collection({
  name: "links",
  description: "Social links that appear in the footer",
  store: "my_fs:links/*.md",
  fields: [
    "title: text",
    {
      name: "link",
      type: "url",
      label: "Link (needs to begin with https://)"
    },
  ],
  nameField: "title",
});

// 5. Configure a folder to upload files
cms.upload("uploads", "my_fs:uploads");

// 6. Export the cms configuration
export default cms;
