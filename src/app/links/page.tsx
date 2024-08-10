import { Metadata } from "next";
import React from "react";

import { fetchGraphql } from "@/lib/utils";
import { gql } from "../__generated__";
import moment from "moment";
import Markdown from "react-markdown";
import { Article, LastUpdate, MdLink } from "@/components/Article";
import Link from "@/components/Link";

const GET_RESOURCES_CONTENT = gql(/* GraphQL */ `
  query GetResourcesContent {
    resourcesContent {
      content
      lastModified
    }
  }
`);

export const metadata: Metadata = {
  title: "RESOURCES",
};

export default async function Links() {
  const content = (await fetchGraphql(GET_RESOURCES_CONTENT)).resourcesContent;
  const date = moment(content.lastModified).format("DD/MM/YYYY");

  return (
    <Article>
      <div>
        <Markdown components={{
          "a": MdLink
        }}>{content.content}</Markdown>
      </div>
      <LastUpdate>Last update: {date}</LastUpdate>
    </Article>
  );
}