import lumeCMS from "lume/cms/mod.ts";
import GitHub from "lume/cms/storage/github.ts";
import { Octokit } from "npm:octokit";
import fields from "lume/cms/fields/core.ts";

const username = Deno.env.get("USERNAME");
const password = Deno.env.get("PASSWORD");

// 1. Create the cms instance
const cms = lumeCMS({
  site: {
    name: "Void Femmes",
    url: "voidfemmes.ca",
  }, 
  auth: {
    method: "basic",
    users: {
      [username]: password,
    },
  },
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
    "author: text",
    {
      name: "draft",
      type: "checkbox",
    },
    {
      name: "published",
      type: "datetime",
      mode: "create"
    },
    "content: markdown",
    "tags: list",
  ],
  nameField: "title",
});
cms.collection("pages", "my_fs:pages/*.md", [
  "title: text",
  "content: markdown",
]);

// 5. Configure a folder to upload files
cms.upload("uploads", "my_fs:uploads");

// 6. Export the cms configuration
export default cms;
