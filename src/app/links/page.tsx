import { Metadata } from "next";
import React from "react";
import css from "./style.module.css";

import { fetchGraphql } from "@/lib/utils";
import { gql } from "../__generated__";
import moment from "moment";
import Markdown from "react-markdown";

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
    <div className={css.resources}>
      <div>
        <Markdown>{content.content}</Markdown>
      </div>
      <span className={css.lastUpdate}>Last update: {date}</span>
    </div>
  );
}