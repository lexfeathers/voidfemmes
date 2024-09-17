import lume from "lume/mod.ts";
import nunjucks from "lume/plugins/nunjucks.ts";
import favicon from "lume/plugins/favicon.ts";
import sitemap from "lume/plugins/sitemap.ts";
import date from "lume/plugins/date.ts";
import metas from "lume/plugins/metas.ts";
import feed from "lume/plugins/feed.ts";
import _cleancss from 'https://deno.land/x/lume_cleancss@v0.2.0/mod.ts';
import { underline } from "lume/deps/colors.ts";

const site = lume({
  location: new URL("https://voidfemmes.ca"),
});
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
site.use(metas());
site.use(feed({
  output: ["/feed.rss"],

  query: "type=posts",
  sort: "date=desc",

  info: {
    title: "Void Femmes",
    description:
      "music and ideas by Lex Feathers",
    lang: "en",
    generator: false,
  },
  items: {
    title: "=title",
    description: "=excerpt",
    published: "=date",
    updated: undefined,
    content: "=children",
    lang: "en",
    image: "=image", // The image of the item
  },
}));


site.copy("/assets/"); // Iclude assets in the build
site.copy("/uploads/"); // Iclude assets in the build

export default site;
