import lume from "lume/mod.ts";
import nunjucks from "lume/plugins/nunjucks.ts";
import favicon from "lume/plugins/favicon.ts";
import sitemap from "lume/plugins/sitemap.ts";
import date from "lume/plugins/date.ts";
import metas from "lume/plugins/metas.ts";
import feed from "lume/plugins/feed.ts";
import _cleancss from 'https://deno.land/x/lume_cleancss@v0.2.0/mod.ts';

const site = lume();
site.use(nunjucks());
site.use(favicon({
  input: "/assets/favicon.ico",
}));
site.use(sitemap({
  filename: "sitemap.xml", // to change the sitemap filename
  sort: "date=desc", // To sort by data in ascendent order
}));
site.use(date({
  formats: {
    "MDY": "M/d/yyyy",
  },
}));
site.use(metas({/* Options */}));
site.use(feed({
  output: ["/feed.rss", "/feed.json"], // The file or files that must be generated
  query: "type=post", // Select only pages of type=post
  sort: "date=desc", // To sort by data in ascendent order
  limit: 10, // To show only the 10 first results
  info: {
    title: "=site_name", // The feed title
    description: "=site.description", // The feed subtitle
    published: new Date(), // The publishing date
    lang: "en", // The language of the feed
    generator: true, // Set `true` to automatically generate the "Lume {version}"
  },
  items: {
    title: "=title", // The title of every item
    description: "=excerpt", // The description of every item
    published: "=date", // The publishing date of every item
    updated: undefined, // The last update of every item
    content: "=children", // The content of every item
    lang: "=lang", // The language of every item
    image: "=cover", // The image of the item
  },
}));


site.copy("/assets/"); // Iclude assets in the build
site.copy("/uploads/"); // Iclude assets in the build

export default site;
