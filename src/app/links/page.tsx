import { Metadata } from "next";
import React from "react";

import { fetchGraphql } from "@/lib/utils";
import { gql } from "../__generated__";
import Markdown from "react-markdown";
import { Article, LastUpdate, MdLink } from "@/components/Article";
import Date from "@/components/Date";

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

  return (
    <Article>
      <div>
        <Markdown components={{
          "a": MdLink
        }}>{content.content}</Markdown>
      </div>
      <LastUpdate>Last update: <Date onlyDate>{content.lastModified}</Date></LastUpdate>
    </Article>
  );
}