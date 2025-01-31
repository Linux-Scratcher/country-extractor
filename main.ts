import * as cheerio from "cheerio";

type Links = {
  title: string;
  link: string;
};

const readHtmlFile = (path: string): string => {
  return Deno.readTextFileSync(path);
};

const markdownHeader = (): string => {
  return "## Countries\n\n| Countries | Websites |\n| - | - |\n";
};

const extractLinksFromHtml = (html: string): Links[] => {
  const $ = cheerio.load(html);
  const links: Links[] = [];
  const aElements = $("a");

  aElements.each((_, cheerioLink) => {
    links.push({
      title: $(cheerioLink).attr("title"),
      link: $(cheerioLink).attr("href"),
    });
  });

  return links;
};

const markdownFromLink = (link: Links): string => {
  return `| ${link.title} | [${link.link}](${link.link}) |\n`;
};
if (import.meta.main) {
  let markdownOutput = markdownHeader();

  const html = readHtmlFile("./countries.html");

  const links = extractLinksFromHtml(html);

  links.forEach((link) => {
    markdownOutput += markdownFromLink(link);
  });

  console.log(markdownOutput);
  Deno.writeTextFileSync("./countries.md", markdownOutput);
}
