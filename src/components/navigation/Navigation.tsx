import { gql } from "@/app/__generated__/gql";
import { query } from "@/app/ApolloClient";
import { NavLink } from "../Link";
import { Burger, Label, Logo, Nav } from "./components";
import HiddenCheckbox from "./HiddenCheckbox";
import Menu from "./Menu";
import { getPages } from "./pages";

const HIDDEN_CHECKBOX_NAME = "menu_opened";

const GET_EVENTS = gql(/* GraphQL */ `
  query GetEventList {
    events {
      handle
      lastEdition {
        id
      }
    }
  }
`);

export default async function Navigation() {
  const events = await query({
    query: GET_EVENTS,
    context: { fetchOptions: { cache: "no-store" } },
  });
  const filteredEvents = {
    ...events,
    events: events.data?.events.filter((event) => event.lastEdition) ?? [],
  };

  const pages = getPages(filteredEvents);

  return (
    <Nav>
      <HiddenCheckbox name={HIDDEN_CHECKBOX_NAME} />

      <Logo>
        <NavLink href="/">Obstacle</NavLink>
      </Logo>

      <Burger>
        <Label htmlFor={HIDDEN_CHECKBOX_NAME} />
      </Burger>

      <Menu pages={pages} />
    </Nav>
  );
}
