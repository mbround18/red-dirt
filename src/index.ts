import { Octokit } from "@octokit/core";

const owner = "mbround18";
const repo = "red-dirt";
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

async function main() {
  const response = await octokit.request(`GET /repos/${owner}/${repo}/issues`, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
    filter: "all",
    state: "open",
    sort: "created",
  });

  const headers = [
    "Title",
    "Issue URL",
    "Product URL",
    "Category",
    "Cost",
    "Requires",
  ];
  const content = [headers];

  response.data.forEach((issue: any) => {
    const [category, title] = issue.title.split("]");
    const row = [
      title.replace(":", "").trim(),
      issue.html_url,
      issue.body.split("](")[1].split(")")[0].trim().replace(/[{}]/g, ""),
      category.replace("[", ""),
      parseFloat(issue.body.split("Cost: ")[1].trim().replace(/\,/g, "")),
      issue.labels
        .map((label: any) => label.name.replace("Requires: ", ""))
        .join(", "),
    ];
    content.push(row);
    // console.log(`
    //         Title: ${title.replace(":", "").trim()}
    //         Issue URL: ${issue.html_url}
    //         Product URL: ${issue.body
    //           .split("](")[1]
    //           .split(")")[0]
    //           .trim()
    //           .replace(/[{}]/g, "")}
    //         Category: ${category.replace("[", "")}
    //         Cost: ${parseFloat(
    //           issue.body.split("Cost: ")[1].trim().replace(/\,/g, "")
    //         )}
    //         Requires: ${issue.labels
    //           .map((label: any) => label.name.replace("Requires: ", ""))
    //           .join(", ")}
    //     `);
  });

  for (const contentElement of content) {
    console.log(contentElement.join(","));
  }
}

main()
  .catch(console.error)
  .then(() => process.exit(0));
